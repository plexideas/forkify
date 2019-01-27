import axios from 'axios';
import { proxy, key, host } from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    };

    async getRecipe() {
        
        try {
            const res = await axios(`${proxy}${host}/get?key=${key}&rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch (error) {
            alert(`Something went wrong :(`);
        }
    };

    calcTime() {
        const numInt = this.ingredients.length;
        const periods = Math.ceil(numInt / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitShort, 'kg', 'g'];
        const newIngredients = this.ingredients.map(el => {
            // 1) Uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitShort[i]);
            });
            // 2) Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // 3) Parse ingredient into count, unit and ingredient
            const arrInt = ingredient.split(' ');
            const unitIndex = arrInt.findIndex(el2 => units.includes(el2));

            let objInt;
            if (unitIndex > -1) {
                // There is unit
                const arrCount = arrInt.slice(0, unitIndex);

                let count;
                if (arrCount.length === 1) {
                    count = eval(arrInt[0].replace('-', '+'));
                } else {
                    count = eval(arrInt.slice(0, unitIndex).join('+'));
                }

                objInt = {
                    count,
                    unit: arrInt[unitIndex],
                    ingredient: arrInt.slice(unitIndex + 1).join(' '),
                }

            } else if (parseInt(arrInt[0], 10)) {
                objInt = {
                    count: parseInt(arrInt[0], 10),
                    unit: '',
                    ingredient: arrInt.slice(1).join(' '),
                }
            } else if (unitIndex === -1) {
                // There is NO unit and NO number in 1st position
                objInt = {
                    count: 1,
                    unit: '',
                    ingredient,
                }
            }
            return objInt;
        });

        this.ingredients = newIngredients;
    };

    updateServings (type) {
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        })

        this.servings = newServings;
    };
};