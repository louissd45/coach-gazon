export default function ProductSuggestion({ product }) {
  if (!product) return null;

  return (
    <a
      href={product.lien_externe}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="product-suggestion"
    >
      {product.image_url && (
        <img
          src={product.image_url}
          alt=""
          className="product-suggestion__image"
        />
      )}
      <div className="product-suggestion__info">
        <p className="product-suggestion__name">{product.nom}</p>
        {product.prix && (
          <p className="product-suggestion__price">{product.prix} €</p>
        )}
      </div>
      <span className="product-suggestion__cta">Voir le produit →</span>
    </a>
  );
}
