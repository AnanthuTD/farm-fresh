"use client";

import type React from "react";

import { useCart, generateWhatsAppUrl } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, Trash2, ShoppingBag, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function CartPage() {
  const { state, dispatch } = useCart();
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    deliveryTime: "",
    notes: "",
  });

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      dispatch({ type: "REMOVE_ITEM", payload: id });
    } else {
      dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
    }
  };

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
    toast("Item removed", {
      description: "Item has been removed from your cart.",
    });
  };

  const handleWhatsAppCheckout = async () => {
    if (state.items.length === 0) {
      toast("Cart is empty", {
        description: "Please add items to your cart before placing an order.",
      });
      return;
    }

    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      toast("Missing information", {
        description:
          "Please fill in your name, phone, and address for WhatsApp checkout.",
      });
      return;
    }

    const fullAddress = `${customerInfo.address}${
      customerInfo.notes ? `\nNotes: ${customerInfo.notes}` : ""
    }\nContact: ${customerInfo.name} - ${customerInfo.phone}`;

    try {
      const whatsappUrl = await generateWhatsAppUrl(state.items, fullAddress);
      window.open(whatsappUrl, "_blank");

      toast("Redirecting to WhatsApp", {
        description: "Your order details have been prepared for WhatsApp.",
      });
    } catch (error) {
      console.error("Error generating WhatsApp URL:", error);
      toast("Error", {
        description: "Failed to generate WhatsApp link. Please try again.",
      });
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleWhatsAppCheckout();
  };

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo((prev) => ({ ...prev, [field]: value }));
  };

  if (state.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Your cart is empty
          </h1>
          <p className="text-muted-foreground mb-6">
            Add some delicious items to get started!
          </p>
          <Link href="/products">
            <Button size="lg">Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">Your Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Cart Items ({state.items.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {state.items.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🛒</div>
                  <h3 className="text-lg font-semibold mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Add some delicious products to get started!
                  </p>
                  <Button asChild>
                    <a href="/products">Browse Products</a>
                  </Button>
                </div>
              ) : (
                state.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-4 p-4 border rounded-lg"
                  >
                    <div className="relative h-16 w-16 flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground">
                        {item.name}
                      </h3>
                      <div className="text-sm text-muted-foreground space-y-1">
                        {item.weight && (
                          <p>
                            Weight: {item.weight}{" "}
                            {item.weightUnit === "g" ? "g" : "kg"}
                          </p>
                        )}
                        {item.customInstructions && (
                          <p className="text-xs italic">
                            Instructions: {item.customInstructions}
                          </p>
                        )}
                      </div>
                      <Badge variant="secondary" className="mt-1">
                        {item.category.charAt(0).toUpperCase() +
                          item.category.slice(1)}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="text-right">
                      {item.category === "chicken" ? (
                        <div>
                          <p className="font-semibold text-foreground">
                            Price on WhatsApp
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Contact us for pricing
                          </p>
                        </div>
                      ) : (
                        <>
                          <p className="font-semibold text-foreground">
                            ₹{item.price * item.quantity}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            ₹{item.price} each
                          </p>
                        </>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary & Checkout */}
        <div>
          {state.items.length > 0 ? (
            <>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {(() => {
                      const nonChickenItems = state.items.filter(
                        (item) => item.category !== "chicken"
                      );
                      const chickenItems = state.items.filter(
                        (item) => item.category === "chicken"
                      );
                      const subtotal = nonChickenItems.reduce(
                        (sum, item) => sum + item.price * item.quantity,
                        0
                      );

                      return (
                        <>
                          {nonChickenItems.length > 0 && (
                            <>
                              <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>₹{subtotal}</span>
                              </div>
                              {chickenItems.length > 0 && (
                                <div className="text-sm text-muted-foreground">
                                  *Chicken items priced separately via WhatsApp
                                </div>
                              )}
                            </>
                          )}
                          {chickenItems.length > 0 &&
                            nonChickenItems.length === 0 && (
                              <div className="text-sm text-muted-foreground">
                                *All items are chicken - pricing will be
                                provided via WhatsApp
                              </div>
                            )}
                          <div className="flex justify-between">
                            <span>Delivery Fee</span>
                            <span>Free</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between font-semibold text-lg">
                            <span>Total</span>
                            <span>₹{subtotal}</span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Delivery Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitOrder} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={customerInfo.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email (Optional)</Label>
                      <Input
                        id="email"
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">Delivery Address *</Label>
                      <Textarea
                        id="address"
                        value={customerInfo.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        required
                        rows={3}
                      />
                    </div>

                    {/* <div>
                      <Label htmlFor="deliveryTime">
                        Preferred Delivery Time
                      </Label>
                      <Select
                        value={customerInfo.deliveryTime}
                        onValueChange={(value) =>
                          handleInputChange("deliveryTime", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select time slot" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Morning (9 AM - 12 PM)">
                            Morning (9 AM - 12 PM)
                          </SelectItem>
                          <SelectItem value="Afternoon (12 PM - 4 PM)">
                            Afternoon (12 PM - 4 PM)
                          </SelectItem>
                          <SelectItem value="Evening (4 PM - 8 PM)">
                            Evening (4 PM - 8 PM)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div> */}

                    <div>
                      <Label htmlFor="notes">
                        Special Instructions (Optional)
                      </Label>
                      <Textarea
                        id="notes"
                        value={customerInfo.notes}
                        onChange={(e) =>
                          handleInputChange("notes", e.target.value)
                        }
                        rows={2}
                        placeholder="Any special requests or notes..."
                      />
                    </div>

                    <Button type="submit" className="w-full" size="lg">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      {(() => {
                        const nonChickenItems = state.items.filter(
                          (item) => item.category !== "chicken"
                        );
                        const subtotal = nonChickenItems.reduce(
                          (sum, item) => sum + item.price * item.quantity,
                          0
                        );
                        return `Checkout via WhatsApp - ₹${subtotal}${
                          state.items.some(
                            (item) => item.category === "chicken"
                          )
                            ? " + Chicken"
                            : ""
                        }`;
                      })()}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      You&apos;ll be redirected to WhatsApp to complete your
                      order
                    </p>
                  </form>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground">
                  Add items to your cart to see order summary and checkout
                  options.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
