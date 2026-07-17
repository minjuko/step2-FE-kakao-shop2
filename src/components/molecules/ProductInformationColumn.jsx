import { comma } from "../../utils/convert";
import Photo from "../atoms/Photo";
import StarRating from "../organisms/StarRating";

const staticServerUri = process.env.REACT_APP_PATH || "";


const ProductInformationColumn = ({ product}) => {
    const { productName, price} = product;

return (
    <section className="grid gap-5 sm:grid-cols-[minmax(0,2fr)_minmax(180px,1fr)]">
        <div>
            <Photo src={`${staticServerUri}/assets${product.image}`} alt={productName} className="aspect-square w-full rounded-lg object-cover"/>
        </div>
        <div className="flex flex-col gap-2">
        <StarRating starCount={product.starCount}/>
        <h1 className="text-xl font-bold">{product.productName}</h1>
            <p>톡딜가 <strong>{comma(price)}원</strong></p>
        </div>
    </section>
);
};

export default ProductInformationColumn;
