import pandas as pd, numpy as np, matplotlib.pyplot as plt
import googlemaps
from haversine import haversine, Unit

from math import *
from sklearn.cluster import DBSCAN
from sklearn.metrics.pairwise import haversine_distances
from geopy.distance import great_circle
from shapely.geometry import MultiPoint

np.set_printoptions(suppress=True)


def tsp(graph, s=0):
    n = len(graph)
    dp = [[-1 for _ in range(1 << n)] for __ in range(n)]
    par = [[-1 for _ in range(1 << n)] for __ in range(n)]
    def dfs(v, node):
        if v == (1 << n)-1: # every state visited
            dp[node][v] = 0
            return dp[node][v]
        if dp[node][v] >= 0:
            return dp[node][v]

        mn = float("inf")
        for i in range(n):
            if (not (v & (1 << i))) and (graph[node][i] != 0):
                res = graph[node][i] + dfs(v | (1 << i), i)
                if res < mn:
                    mn = res
                    par[node][v] = i

        dp[node][v] = mn
        return mn

    dfs(1,s)

    path = []
    node = s
    vis = 1
    while par[node][vis] != -1:
        path.append(node)
        node = par[node][vis]
        vis |= (1 << node)
    path.append(node)
    return path

def geolocation_cluster(df, d=6, h=10, r=3):  # df will be a pandas DataFrame
    trip_length = d
    hours_per_day = h
    rating = r

    warnings = []

    dataframe = df.to_numpy()

    coords = df[["lat", "lon"]].values
    # print(coords)

    # graph = haversine_distances(coords, coords)
    # print(graph)
    # n = len(graph)
    # avg_dist = sum(sum(x) for x in graph)/(n*n)




    # NOTE: epsilon and minimum samples should be tweaked according to entry data
    kms_per_radian = 6371.0088

    rad_coords = []
    for i in coords:
        rad_coords.append(list(map(radians, i)))

    hd = haversine_distances(rad_coords, rad_coords)

    n = len(hd)
    avg_dist = sum(sum(x) for x in hd / (n * (n-1)))

    # print(avg_dist)

    epsilon = 15 / kms_per_radian
    samples = max(1, int((len(coords)/trip_length)-1))
    db = DBSCAN(eps=avg_dist, min_samples=samples, algorithm='ball_tree', metric='haversine').fit(np.radians(coords))

    if samples <= 2 and trip_length > 3:
        warnings.append("The program detected that you haven't entered many locations relative to the trip length, "
                        "this may result in a very sparse schedule. Consider adding more locations or reducing" 
                        " the trip length if the results aren't as desired.")

    cluster_labels = db.labels_
    outliers = -1 in cluster_labels
    num_clusters = len(set(cluster_labels))
    if outliers:
        num_clusters -= 1

    clusters = pd.Series([coords[cluster_labels == n] for n in range(num_clusters)])

    # print(clusters)

    def get_centermost_point(cluster):
        centroid = (MultiPoint(cluster).centroid.x, MultiPoint(cluster).centroid.y)
        centermost_point = min(cluster, key=lambda point: great_circle(point, centroid).m)
        return tuple(centermost_point)

    centermost_points = []
    for cluster in clusters:
        if len(cluster) > 0:
            centermost_points.append(get_centermost_point(cluster))

    # lats, lons = zip(*centermost_points)
    # rs = pd.DataFrame({'lon': lons, 'lat': lats})

    total_hours = sum(l[3] for l in dataframe)
    # print(total_hours)

    location_duration_dict = {}
    location_day_dict = {}
    location_name_dict = {}
    for loc in dataframe:
        location_duration_dict[(loc[1], loc[2])] = loc[3]

    for loc in dataframe:
        location_name_dict[(loc[1], loc[2])] = loc[0]

    num_centers = []
    cluster_hours = []

    for num, cluster in enumerate(clusters):
        print(location_duration_dict)
        cluster_hours.append(sum(location_duration_dict[(idx[0], idx[1])] for idx in cluster))
        num_centers.append(min(1,round(cluster_hours[num] / total_hours * trip_length)))  # how many days should be spent at each cluster

    if abs(sum(num_centers) - total_hours / hours_per_day) > 1:  # if the amount of days doesn't match the total trip time
        warnings.append("It was detected that too many events were chosen for the given time frame. "
                        "A schedule has been generated to match the given restrictions as closely as possible. "
                        "Consider changing the time frame or locations visited for optimal results.")

    # print(total_hours)
    # print(cluster_hours)
    # print(num_centers)

    def circular_point(start, tc, d):  # tc is the heading in radians clockwise of true north
        lat1, lon1 = start[0] * pi / 180, start[1] * pi / 180
        d /= 6731  # conversion from km to radians
        lat2 = asin(sin(lat1) * cos(d) + cos(lat1) * sin(d) * cos(tc))
        dlon = atan2(sin(tc) * sin(d) * cos(lat1), cos(d) - sin(lat1) * sin(lat2))
        lon2 = ((lon1 + dlon + pi) % (2 * pi)) - pi

        return [lat2, lon2]  # returned in radians

    # one dimension for each cluster another for days in each cluster
    schedule = [[[] for __ in range(num_centers[_])] for _ in range(num_clusters)]
    schedule_hours = [[] for _ in range(num_clusters)]

    for cid, cluster in enumerate(clusters):
        if num_centers[cid] < 1:
            continue

        deg_inc = radians(360 / num_centers[cid])  # degree increments in radians
        dst = 2  # distance from center to plot the circular points

        circular_points = [circular_point(centermost_points[cid], deg_inc * x, dst) for x in range(num_centers[cid])]
        temp_cluster = []
        for location in cluster:
            temp_cluster.append(list(map(radians, location)))

        dist_matrix = haversine_distances(temp_cluster, circular_points)

        indices = [[i] for i in range(len(cluster))]
        dist_matrix = np.append(dist_matrix, indices, axis=1)

        dist_matrix = np.asarray(sorted(dist_matrix, key=lambda x: sum(x[:num_centers[cid]]), reverse=True))

        hours_remaining = [hours_per_day for _ in range(num_centers[cid])]

        for row in dist_matrix:  # each activity
            activity = cluster[int(row[num_centers[cid]])]
            activity_length = location_duration_dict[(activity[0], activity[1])]  # gets activity length from data set
            n_row = [[row[i], i] for i in range(num_centers[cid])]
            priority_list = sorted(n_row, key=lambda x: x[0], reverse=True)  # greedily selects which day it should add to first
            add_to = 0
            max_hours_avail = 0  # the maximum hours a day can offer for an activity

            remaining_activity_length = activity_length

            # Greedy Algorithm
            for a, i in priority_list:
                hours_avail = max(min(hours_remaining[i], remaining_activity_length),
                                  0)  # the number of hours this day can offer
                if max_hours_avail < hours_avail:
                    add_to = i
                    max_hours_avail = hours_avail
                remaining_activity_length -= hours_avail

            hours_remaining[add_to] -= activity_length

            schedule[cid][add_to].append([activity[0], activity[1]])
            location_day_dict[(activity[0], activity[1])] = add_to
        schedule_hours[cid] = hours_remaining

    for cid, cluster in enumerate(schedule):
        print("Cluster #%s" % cid)
        for did, day in enumerate(cluster):
            print("Day #%s" % did)
            for location in day:
                print(location, "Hours spent at location: ", location_duration_dict[
                    (location[0], location[1])])  # Hotels don't have a duration dict will need to accomodate

    #  Handle Outliers
    for index, location in enumerate(cluster_labels):
        if len(clusters) == 0:
            centermost_points = [coords[0],coords[1]]
        if location == -1:
            found = False
            lat, lon, dur = df['lat'][index], df['lon'][index], df['duration'][index]
            latlon = [radians(lat), radians(lon)]
            temp_centermost_points = []
            for center in centermost_points:
                temp_centermost_points.append([radians(center[0]), radians(center[1])])

            hd_matrix = haversine_distances([latlon], temp_centermost_points)
            dist_matrix = []
            for i, distance in enumerate(hd_matrix[0]):
                dist_matrix.append([distance, i])

            dist_matrix = np.asarray(sorted(dist_matrix, key=lambda x: x[0]))

            for distance, cid in dist_matrix:
                if found:
                    break
                cid = int(cid)
                closest_dists = []
                for did, day in enumerate(schedule[cid]):
                    rad_day = []
                    for aclat, aclon in day:
                        rad_day.append([radians(aclat), radians(aclon)])
                    dists = haversine_distances([latlon], rad_day)
                    closest_dists.append([np.amin(dists), did])
                closest_dists = sorted(closest_dists, key=lambda x: x[0])
                # print(closest_dists)

                for dist_to_closest, did in closest_dists:
                    if found:
                        break
                    dist_km = dist_to_closest * kms_per_radian
                    if (schedule_hours[cid][did] - (dist_km*2)/45) > -1: #if going to the outlier will leave at least -1 hours in the day
                        schedule[cid][did].append([lat,lon])
                        found = True

            if not found:
                warnings.append("The program detected that there was an outlier location at " + location_name_dict[(lat,lon)] + ". There were no times in the schedule where the location could be "
                                "slotted. Consider changing the visit duration of that location or the timeframe "
                                "of the trip for better results.")

    gmaps = googlemaps.Client(key='AIzaSyBQStAxxL0wjGxNFPIixAsjHwXRbRVhmkg')

    hotel_names = []  # hotel for each cluster
    hotel_latlons = []  # hotel latitude longitude
    hotel_availability = []  # if a hotel can be found

    def get_centroid(cluster):
        centroid = (MultiPoint(cluster).centroid.x, MultiPoint(cluster).centroid.y)
        return centroid

    final_schedule = [[[] for __ in range(num_centers[_])] for _ in range(num_clusters)]

    for cid, cluster in enumerate(clusters):
        centroid = get_centroid(cluster)
        search_query = googlemaps.client.places(client=gmaps, query="hotels", location=centroid, radius=15000)
        # print(search_query)
        # print(centroid)

        min_dist = float("inf")

        hotel_name = ""
        hotel_latlon = ""
        hotel_rating = 0

        if search_query['status'] == "OK":
            # print("ok")
            for result in search_query['results']:
                result_name = result['name']
                result_latlon = [result['geometry']['location']['lat'], result['geometry']['location']['lng']]
                result_rating = result['rating']
                result_dist = haversine(centroid, result_latlon)

                # print("Name:",result_name,"LatLon:",result_latlon,"Rating:",result_rating,"Dist:",result_dist)

                if abs(result_rating - rating) <= 0.5 and abs(hotel_rating - rating) <= 0.5 and result_dist < min_dist:
                    hotel_name = result_name
                    hotel_latlon = result_latlon
                    hotel_rating = result_rating
                    min_dist = result_dist

                elif abs(result_rating - rating) <= 0.5 and 0.5 > abs(hotel_rating - rating):
                    hotel_name = result_name
                    hotel_latlon = result_latlon
                    hotel_rating = result_rating
                    min_dist = result_dist

                elif abs(result_rating - rating) < abs(hotel_rating - rating):
                    hotel_name = result_name
                    hotel_latlon = result_latlon
                    hotel_rating = result_rating
                    min_dist = result_dist

            hotel_names.append(hotel_name)
            hotel_latlons.append(hotel_latlon)

            if hotel_name:
                hotel_availability.append(True)
                location_duration_dict[(hotel_latlon[0], hotel_latlon[1])] = 999
            else:
                warnings.append("Couldn't find a hotel for cluster " + str(cid) + ". The algorithm has calculated the"
                                " schedule based on the first activity for those days. Please find suitable accommodation.")
                hotel_availability.append(False)
        else:
            # print("status not ok")
            warnings.append("Couldn't find a hotel for cluster " + str(cid) + ". The algorithm has calculated the"
                            " schedule based on the first activity for those days. Please find suitable accommodation.")
            hotel_availability.append(False)
            hotel_names.append("")
            hotel_latlons.append([])

    for cid, cluster in enumerate(schedule):
        for did, day in enumerate(cluster):
            hotel_and_locations = []
            n = len(day)
            if hotel_availability[cid]:
                n = len(day) + 1
                hotel_and_locations.append(hotel_latlons[cid])

            graph = [[0 for _ in range(n)] for __ in range(n)]

            for i in schedule[cid][did]:
                hotel_and_locations.append(i)
            tm_dict = googlemaps.client.distance_matrix(client=gmaps,
                                                        origins=hotel_and_locations,
                                                        destinations=hotel_and_locations)

            rows = tm_dict['rows']
            for rw, row in enumerate(rows):
                elements = row['elements']
                for cl, element in enumerate(elements):
                    if element['status'] == "OK":
                        graph[rw][cl] = element['duration']['value']
                    else:
                        warnings.append("There were issues generating the distances between locations, please check"
                                        "that all of the locations are in valid locations.")

            path = tsp(graph)
            if hotel_availability[cid]:
                final_schedule[cid][did].append(hotel_latlons[cid])
                for i in path[1:]:
                    final_schedule[cid][did].append(day[i-1])
                final_schedule[cid][did].append(hotel_latlons[cid])
            else:
                for i in path:
                    final_schedule[cid][did].append(day[i])

    '''
    # Display clusters on matplotlib
    cmap = plt.cm.get_cmap('hsv', int(round(total_hours / hours_per_day)))
    cmap2 = plt.cm.get_cmap('Greys', num_clusters + (1 if outliers else 0))

    fig, ax = plt.subplots(figsize=[10, 6])

    # rs_scatter = ax.scatter(rs['lon'], rs['lat'], c='k', edgecolor='None', alpha=1, s=200)

    cmap_ind = 0
    for cluster in schedule:
        for day in cluster:
            for location in day:
                ax.scatter(location[1], location[0], color=cmap(cmap_ind), alpha=1, s=110)
            cmap_ind += 1

    for i in range(len(cluster_labels)):
        df_scatter = ax.scatter(df['lon'][i], df['lat'][i], color=cmap2(cluster_labels[i]), alpha=1, s=60)

    ax.set_title('Full data set vs DBSCAN reduced set')
    ax.set_xlabel('Longitude')
    ax.set_ylabel('Latitude')
    # ax.legend([df_scatter, rs_scatter], ['Full set', 'Reduced set'], loc='upper right')
    plt.show()
    '''

    for cid, cluster in enumerate(final_schedule):
        print("Cluster #%s" % cid)
        for did, day in enumerate(cluster):
            print("Day #%s" % did)
            for location in day:
                print(location, "Hours spent at location: ", location_duration_dict[(location[0],location[1])]) #Hotels don't have a duration dict will need to accomodate
    print(warnings)

    return final_schedule, warnings


# data = np.array([  # test dataframe
#     [1.315249, 103.816255, 2],
#     [1.296586, 103.848335, 3],
#     [1.289530, 103.863248, 3],
#     [1.4037233, 103.7858772, 4],
#     [1.2713286, 103.8172769, 2],
#     [1.2569835, 103.8180789, 3],
#     [1.2805229, 103.8638607, 4],
#     [1.2843188, 103.8571331, 1],
#     [1.301674, 103.8358879, 1],
#     [1.32108, 103.7030203, 2],
#     [1.2564851, 103.818169, 3],
#     [1.2540373, 103.8154328, 4],
#     [1.2644032, 103.8200184, 2],
# ])
#
# df = pd.DataFrame(data, columns=["lat", "lon", "avg_time"])
#
# schedule, warnings = geolocation_cluster(df,d=3,r=4)
