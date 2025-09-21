export const trackPageView = async (page: string) => {
  try {
    await fetch("/api/analytics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "page_visit",
        page,
        userAgent: navigator.userAgent,
      }),
    })
  } catch (error) {
    console.error("Error tracking page view:", error)
  }
}

export const trackProductView = async (productId: string) => {
  try {
    await fetch("/api/analytics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "product_view",
        productId,
        userAgent: navigator.userAgent,
      }),
    })
  } catch (error) {
    console.error("Error tracking product view:", error)
  }
}
