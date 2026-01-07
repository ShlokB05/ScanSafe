#import user allergen list
#import product allergen list

def Checker(UserAllergen, ProductIngredients):
    UserAllergen = [item.lower() for item in UserAllergen]
    ProductIngredients = [Ingredient.lower() for Ingredient in ProductIngredients]
    return sorted(set(UserAllergen) & set(ProductIngredients))