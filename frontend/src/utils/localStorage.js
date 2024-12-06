export const getFavoritesFromLocalStorage = () => {
    const favoritesJSON = localStorage.getItem('favorites')
    return favoritesJSON ? JSON.parse(favoritesJSON) : []
}

export const addFavoriteToLocalStorage = (product) => {
    const favorites = getFavoritesFromLocalStorage()
    if(!favorites.some(p => p.id === product.id)) {
        favorites.push(product)
        localStorage.setItem('favorites', JSON.stringify(favorites))
    }
}

export const removeFavoriteFromLocalStorage = (productId) => {
    const favorites = getFavoritesFromLocalStorage()
    const updateFavorites = favorites.filter((product) => product.id !== productId)
    localStorage.setItem('favorites', JSON.stringify(updateFavorites))
}
