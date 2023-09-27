let addIngredientsBtn = document.getElementById('addIngredientsBtn');
let ingredientList = document.querySelector('.ingredientList');
let ingredientDiv = document.querySelector('.ingredientDiv')[0];

addIngredientsBtn.addEventListener('click', function(){
    // Création d'une nouvelle div
    let newIngredientDiv = document.createElement('div');
    newIngredientDiv.classList.add('ingredientDiv');
    newIngredientDiv.classList.add('mb-1');
    // Création d'un nouvel input
    let newIngredientInput = document.createElement('input');
    newIngredientInput.classList.add('form-control');
    newIngredientInput.setAttribute('type', 'text');
    newIngredientInput.setAttribute('name', 'ingredients');
    // Ajout du nouvel input dans la nouvelle div
    newIngredientDiv.appendChild(newIngredientInput);
    // Ajout de la nouvelle div dans la liste des ingrédients
    ingredientList.appendChild(newIngredientDiv);
});