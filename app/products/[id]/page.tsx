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
import { ArrowLeft, ShoppingCart, MessageCircle } from "lucide-react";
import {
  products,
  useCart,
  generateWhatsAppUrl,
  type CartItem,
} from "@/lib/cart-context";
import { trackProductView } from "@/lib/analytics";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { dispatch } = useCart();

  const product = products.find((p) => p.id === params.id);

  const [selectedCutType, setSelectedCutType] = useState("");
  const [isSkinless, setIsSkinless] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [weight, setWeight] = useState(1);
  const [customInstructions, setCustomInstructions] = useState("");

  useEffect(() => {
    if (product) {
      trackProductView(product.id);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Button onClick={() => router.push("/products")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  // Initialize cut type if not set
  if (!selectedCutType && product.cutTypes.length > 0) {
    setSelectedCutType(product.cutTypes[0]);
  }

  const handleAddToCart = () => {
    const cartItem: Omit<CartItem, "quantity"> & { quantity: number } = {
      id: `${product.id}-${selectedCutType}-${
        isSkinless ? "skinless" : "skin"
      }-${Date.now()}`,
      name: product.name,
      price: product.price,
      cutType: selectedCutType,
      category: product.category,
      image: product.image,
      skinless: product.hasSkinOption ? isSkinless : undefined,
      customInstructions: customInstructions || undefined,
      weight: weight,
      quantity: quantity,
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
    const cartItem: CartItem = {
      id: `${product.id}-${selectedCutType}-${
        isSkinless ? "skinless" : "skin"
      }-${Date.now()}`,
      name: product.name,
      price: product.price,
      cutType: selectedCutType,
      category: product.category,
      image: product.image,
      skinless: product.hasSkinOption ? isSkinless : undefined,
      customInstructions: customInstructions || undefined,
      weight: weight,
      quantity: quantity,
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
            {product.category.charAt(0).toUpperCase() +
              product.category.slice(1)}
          </Badge>
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
            <div className="text-2xl font-bold text-primary">
              ₹{product.price}/{product.weightUnit}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Customize Your Order</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Cut Type Selection */}
              <div>
                <Label htmlFor="cut-type">Cut Type</Label>
                <Select
                  value={selectedCutType}
                  onValueChange={setSelectedCutType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select cut type" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.cutTypes.map((cutType) => (
                      <SelectItem key={cutType} value={cutType}>
                        {cutType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Skin Option (for chicken only) */}
              {product.hasSkinOption && (
                <div className="flex items-center space-x-2">
                  <Switch
                    id="skinless"
                    checked={isSkinless}
                    onCheckedChange={setIsSkinless}
                  />
                  <Label htmlFor="skinless">Skinless</Label>
                </div>
              )}

              {/* Weight/Quantity */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weight">Weight ({product.weightUnit})</Label>
                  <Input
                    id="weight"
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">Number of pieces</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Custom Instructions */}
              <div>
                <Label htmlFor="instructions">
                  Special Instructions (Optional)
                </Label>
                <Textarea
                  id="instructions"
                  placeholder="Any special cutting instructions or preferences..."
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Total Price */}
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-primary">
                    ₹{product.price * quantity}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={handleAddToCart}
                  variant="outline"
                  className="w-full bg-transparent"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
                <Button onClick={handleBuyNow} className="w-full">
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
