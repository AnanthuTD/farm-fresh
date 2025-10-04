"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ShoppingCart, MessageCircle, Loader2 } from "lucide-react";
import {
  useCart,
  generateWhatsAppUrl,
  type CartItem,
} from "@/lib/cart-context";
import { trackProductView } from "@/lib/analytics";
import { toast } from "sonner";

type Category =
  | "chicken"
  | "fish"
  | "beef"
  | "mutton"
  | "seafood"
  | "combo"
  | "other";

interface CategoryData {
  id: string;
  name: string;
  hideQuantity?: boolean;
}

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  category: Category;
  price: number;
  weight: number;
  weightUnit: 'kg' | 'g' | 'piece';
  available: boolean;
  sku?: string;
  barcode?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { dispatch } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [customInstructions, setCustomInstructions] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/products/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }
        const data = await response.json();
        setProduct(data);

        // Fetch categories to check hideQuantity setting
        const categoriesResponse = await fetch('/api/categories');
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  useEffect(() => {
    if (product) {
      trackProductView(product.id);
    }
  }, [product]);

  // Check if quantity should be hidden for this product's category
  const currentCategory = categories.find(cat => cat.id === product?.category);
  const shouldHideQuantity = currentCategory?.hideQuantity || false;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            {error ? "Error Loading Product" : "Product Not Found"}
          </h1>
          {error && <p className="text-muted-foreground mb-4">{error}</p>}
          <Button onClick={() => router.push("/products")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!product) return;

    const cartItem: CartItem = {
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      variantId: product.id,
      name: product.name,
      price: product.price,
      image: product.image || "/placeholder.svg",
      category: product.category as Category,
      quantity: shouldHideQuantity ? 1 : quantity, // Default to 1 for chicken products
      weight: product.weight,
      weightUnit: product.weightUnit,
      customInstructions: customInstructions || undefined,
    };

    dispatch({
      type: "ADD_ITEM",
      payload: cartItem,
    });

    toast("Added to cart", {
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleBuyNow = () => {
    if (!product) return;

    const cartItem: CartItem = {
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      variantId: product.id,
      name: product.name,
      price: product.price,
      image: product.image || "/placeholder.svg",
      category: product.category as Category,
      quantity: shouldHideQuantity ? 1 : quantity, // Default to 1 for chicken products
      weight: product.weight,
      weightUnit: product.weightUnit,
      customInstructions: customInstructions || undefined,
    };

    const whatsappUrl = generateWhatsAppUrl([cartItem]);
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => router.push("/products")}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Products
      </Button>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative h-96 lg:h-[500px] rounded-lg overflow-hidden">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover"
          />
          <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
            {product.category}
          </Badge>
          {!product.available && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="text-white text-2xl font-bold">
                Currently Unavailable
              </span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {product.name}
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              {product.description}
            </p>
            
            <div className="space-y-4">
              {/* Product Details */}
              <div>
                <div className="text-2xl font-bold text-primary mb-2">
                  ₹{product.price}
                </div>
                <div className="text-sm text-muted-foreground mb-4">
                  {product.weight} {product.weightUnit}
                </div>
                
                {!product.available && (
                  <p className="text-red-500 font-semibold">
                    This product is currently out of stock.
                  </p>
                )}

                {product.category === 'chicken' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> For chicken products, quantity selection is not available online. 
                      After placing your order, we'll contact you via WhatsApp to confirm the exact quantity 
                      based on current availability and your preferences.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Quantity */}
              {!shouldHideQuantity && (
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    disabled={!product.available}
                  />
                </div>
              )}

              {/* Custom Instructions */}
              <div>
                <Label htmlFor="instructions">
                  Special Instructions (Optional)
                </Label>
                <Textarea
                  id="instructions"
                  placeholder="Any special instructions or preferences..."
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  rows={3}
                  disabled={!product.available}
                />
              </div>

              {/* Total Price */}
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-primary">
                    {product.category === 'chicken' ? (
                      <>Price confirmed via WhatsApp</>
                    ) : (
                      <>₹{product.price * quantity}</>
                    )}
                  </span>
                </div>
                {product.category === 'chicken' && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Final price will be confirmed after quantity confirmation via WhatsApp
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={handleAddToCart}
                  variant="outline"
                  className="w-full bg-transparent"
                  disabled={!product.available}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  onClick={handleBuyNow}
                  className="w-full"
                  disabled={!product.available}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Buy Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
