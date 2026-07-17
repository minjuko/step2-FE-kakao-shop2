import { Link } from "react-router-dom";

const Card = ({ to, children, className = "" }) => {
    return (
        <Link
            className={`block w-full rounded-md border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400 ${className}`}
            to={to}
        >
            {children}
        </Link>
    );
};

export default Card;
