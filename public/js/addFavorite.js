alert('addFavorite.js loaded!');
let favoritesBtn = document.getElementById('favorite');
alert(favoritesBtn);
favoritesBtn.addEventListener('click', function(){
    let recipeId = this.getAttribute('data-recipe-id');

    alert(recipeId);
});