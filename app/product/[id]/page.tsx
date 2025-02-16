"use client";
import { useEffect, useState } from "react";
import { use } from "react";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import Navbar from "../../components/Ṇavbar/Navbar";
import Footer from "../../components/Footer";
import { FiInfo } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { BsArrowUpRightCircleFill } from "react-icons/bs";
import { useCart } from "@/app/components/context/CartContext";

interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  description: string;
  components: string[];
  stock: boolean;
  image: string;
  category: string[];
  occasion: string[];
}

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [giftMessage, setGiftMessage] = useState("");
  const [specialRequest, setSpecialRequest] = useState("");
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const router = useRouter();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "Products", unwrappedParams.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const currentProduct = {
            id: docSnap.id,
            ...docSnap.data(),
          } as Product;
          setProduct(currentProduct);
          // Fetch similar products after getting the current product
          await fetchSimilarProducts(currentProduct);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [unwrappedParams.id]);

  const fetchSimilarProducts = async (currentProduct: Product) => {
    try {
      const productsRef = collection(db, "Products");
      const q = query(
        productsRef,
        where("occasion", "array-contains-any", currentProduct.occasion),
        limit(4)
      );
      const querySnapshot = await getDocs(q);
      const products: Product[] = [];

      querySnapshot.forEach((doc) => {
        if (doc.id !== currentProduct.id) {
          // Exclude current product
          products.push({ id: doc.id, ...doc.data() } as Product);
        }
      });

      // If we don't have enough products, try getting some from the same category
      if (products.length < 3) {
        const categoryQuery = query(
          productsRef,
          where("category", "array-contains-any", currentProduct.category),
          limit(4)
        );
        const categorySnapshot = await getDocs(categoryQuery);
        categorySnapshot.forEach((doc) => {
          if (
            doc.id !== currentProduct.id &&
            !products.find((p) => p.id === doc.id)
          ) {
            products.push({ id: doc.id, ...doc.data() } as Product);
          }
        });
      }

      setSimilarProducts(products.slice(0, 3));
    } catch (error) {
      console.error("Error fetching similar products:", error);
    }
  };

  const getStockStatus = (stock: boolean) => {
    return stock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.image,
      giftMessage: giftMessage,
      specialRequest: specialRequest,
    });
  };

  const handleBuyNow = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.image,
      giftMessage,
      specialRequest,
    });
    router.push('/checkout');
  };

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="rounded-lg overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-[500px] object-cover rounded-lg"
            />
          </div>

          {/* Product Details */}
          <div className="space-y-3">
            <div className="flex flex-row">
              <h1 className="text-4xl font-alegreya font-bold text-headline">
                {product.name}
              </h1>
              <div
                className={`flex justify-center items-center text-sm ml-6 px-4 my-1 rounded-lg ${getStockStatus(
                  product.stock
                )}`}
              >
                <span className="font-semibold">
                  {product.stock ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            </div>
            <p className="text-3xl font-mont font-semibold text-bg4">
              ${product.price}
            </p>

            {/* Gift Options */}
            <div className="space-y-2 pt-">
              <div className="border border-gray-400 p-2 rounded-lg">
                <label className="block text-md font-medium text-gray-700">
                  Gift Message
                </label>
                <textarea
                  className="mt-1 block w-full rounded-md text-sm border-gray-300 shadow-sm focus:border-bg4 focus:ring-bg4"
                  rows={3}
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  placeholder="Enter your gift message here..."
                />
              </div>
              <div className="border border-gray-400 p-2 rounded-lg">
                <label className="block text-md font-medium text-gray-700">
                  Special Requests
                </label>
                <textarea
                  className="mt-1 block w-full rounded-md text-sm border-gray-300 shadow-sm focus:border-bg4 focus:ring-bg4"
                  rows={3}
                  value={specialRequest}
                  onChange={(e) => setSpecialRequest(e.target.value)}
                  placeholder="Any special requests..."
                />
              </div>
            </div>

            {/* Quantity and Purchase Options */}
            <div className="space-y-4 py-4">
              <div className="flex items-center space-x-4">
                <label className="text-md font-medium text-gray-700">
                  Quantity:
                </label>
                <div className="flex items-center border rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 border-r hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-1">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(5, quantity + 1))}
                    className="px-3 py-1 border-l hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-white text-bg4 font-semibold font-sans text-lg border border-bg4/80 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Add to Cart
                </button>
                <button 
                  onClick={handleBuyNow}
                  className="flex-1 bg-emerald-600 text-white font-semibold font-sans text-lg px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Buy Now
                </button>
              </div>
            </div>

            {/* Components */}
            <div className="pb-4">
              <h2 className="text-2xl font-sans font-semibold mb-3 pt-3">
                Includes:
              </h2>
              <ul className="list-disc list-inside space-y-1 font-mont">
                {product.components.map((component, index) => (
                  <li
                    key={index}
                    className="text-gray-600 text-md font-semibold"
                  >
                    {component}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border">
              {/* <p className="text-bg4">{product.description}</p> */}
              <div className="flex items-center my-2 text-gray-500 text-md">
                <FiInfo className="mx-3" size={24} />
                <p>{product.description}</p>
              </div>
            </div>

            {/* Categories and Occasions */}
            <div className="space-y-4 pt-4">
              <div>
                <h3 className="text-md font-semibold mb-2">Categories:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.category.map((cat) => (
                    <span
                      key={cat}
                      className="bg-purple-100 font-semibold text-sm font-mont text-purple-800 px-3 py-1.5 rounded-full"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-md font-semibold mb-2">Perfect for:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.occasion.map((occ) => (
                    <span
                      key={occ}
                      className="bg-pink-100 font-semibold text-sm font-mont text-pink-800 px-3 py-1.5 rounded-full"
                    >
                      {occ}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Similar Hampers Section */}
      <div className="py-8 bg-gradient-to-l from-bg1/20 to-bg4/5 px-4">
        <h2 className="text-4xl font-alegreya font-bold text-headline mb-6 text-center">
          You May Also Like
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {similarProducts.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="h-48 relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 bg-[#f9f9f9]">
                <h3 className="font-alegreya font-bold text-xl mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 font-mont text-sm mb-3">
                  {product.description.substring(0, 100)}...
                </p>
                <div className="flex justify-between items-center">
                  <span className="font-mont font-semibold text-lg text-bg4">
                    ${product.price}
                  </span>
                  <button
                    onClick={() => router.push(`/product/${product.id}`)}
                    className="bg-bg4/90 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-bg4"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shop More Section */}
      <div className="bg-gradient-to-r from-bg1/20 to-bg4/5 pt-8 pb-8 text-center flex items-center flex-col">
        <h2 className="text-3xl font-alegreya font-bold text-headline mb-6">
          Looking for More Options?
        </h2>
        <button
          onClick={() => router.push("/products")}
          className="bg-bg4/90 text-white flex flex-row items-center gap-x-2 font-semibold font-mont text-md px-8 py-3 rounded-lg hover:bg-bg4 transition-colors"
        >
          Shop for more Hampers
          <BsArrowUpRightCircleFill size={30} />
        </button>
      </div>

      <Footer />
    </div>
  );
}
