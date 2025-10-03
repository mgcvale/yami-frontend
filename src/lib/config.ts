const apiUrl = 'http://192.168.0.249:8080';

export default {
    apiUrl: apiUrl,
    apiPaths: {
        user: (id?: number) =>  id ? `${apiUrl}/user/${id}` : `${apiUrl}/user`,
        login: () => `${apiUrl}/user/login`,
        userReviews: (id: number) =>  `${apiUrl}/food/review/from_user/${id}`,
        userStats: (id: number) => `${apiUrl}/user/${id}/stats`,
        follow: (id: number) => `${apiUrl}/user/follow/${id}`,
        searchUser: (searchQuery: string) => `${apiUrl}/user/search/${searchQuery}`,

        food: (id?: number) => id ? `${apiUrl}/food/${id}` : `${apiUrl}/food`,
        foodImage: (id: number) => `${apiUrl}/food/${id}/picture`,
        foodStats: (id: number) => `${apiUrl}/food/${id}/stats`,
        foodReviews: (id: number) => `${apiUrl}/food/${id}/reviews`,

        restaurantSearch: (searchQuery: string) => `${apiUrl}/restaurant/search/${searchQuery}`,
        restaurantImage: (id: number) => `${apiUrl}/restaurant/${id}/picture`,
        restaurant: (id: number) => `${apiUrl}/restaurant/${id}`,
        restaurantFoods: (id: number) => `${apiUrl}/food/by_restaurant/${id}`,
        restaurantReviews: (id: number) => `${apiUrl}/food/review/from_restaurant/${id}`,
    },
    emailRegex: "(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x20\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])",
    fetchTimeout: 3000,
};