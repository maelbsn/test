from flask import Flask, render_template, request

app = Flask(__name__)

def nettoyer_texte(text_input):
    import re
    # Supprimer les retours à la ligne et normaliser les espaces
    text_cleaned = re.sub(r'\n+', ' ', text_input)  # Enlève les retours à la ligne
    text_cleaned = re.sub(r'\s+', ' ', text_cleaned)  # Normalise les espaces
    return text_cleaned

@app.route("/", methods=["GET", "POST"])
def index():
    texte_nettoye = ""
    if request.method == "POST":
        texte_entree = request.form.get("texte_entree", "")
        texte_nettoye = nettoyer_texte(texte_entree)
    return render_template("index.html", texte_nettoye=texte_nettoye)

if __name__ == "__main__":
    app.run(debug=True, port=5005)