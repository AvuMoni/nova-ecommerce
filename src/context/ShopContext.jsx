import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import products from "../data/products";

const ShopContext = createContext(null);

const CART_STORAGE_KEY = "nova_cart";
const WISHLIST_STORAGE_KEY = "nova_wishlist";

export function ShopProvider({ children }) {
  /*
    =========================
    CART STATE
    =========================
  */

  const [cart, setCart] = useState(() => {
    try {
      const savedCart =
        localStorage.getItem(CART_STORAGE_KEY);

      return savedCart
        ? JSON.parse(savedCart)
        : [];
    } catch (error) {
      console.error(
        "Failed to load cart:",
        error
      );

      return [];
    }
  });

  /*
    =========================
    WISHLIST STATE
    =========================
  */

  const [wishlist, setWishlist] = useState(() => {
    try {
      const savedWishlist =
        localStorage.getItem(
          WISHLIST_STORAGE_KEY
        );

      return savedWishlist
        ? JSON.parse(savedWishlist)
        : [];
    } catch (error) {
      console.error(
        "Failed to load wishlist:",
        error
      );

      return [];
    }
  });

  /*
    =========================
    SAVE CART
    =========================
  */

  useEffect(() => {
    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cart)
      );
    } catch (error) {
      console.error(
        "Failed to save cart:",
        error
      );
    }
  }, [cart]);

  /*
    =========================
    SAVE WISHLIST
    =========================
  */

  useEffect(() => {
    try {
      localStorage.setItem(
        WISHLIST_STORAGE_KEY,
        JSON.stringify(wishlist)
      );
    } catch (error) {
      console.error(
        "Failed to save wishlist:",
        error
      );
    }
  }, [wishlist]);

  /*
    =========================
    ADD TO CART
    =========================
  */

  const addToCart = (
    productId,
    quantity = 1,
    selectedSize = null,
    selectedColor = null
  ) => {
    const product = products.find(
      (item) =>
        String(item.id) ===
        String(productId)
    );

    if (!product) {
      console.error(
        "Product not found:",
        productId
      );

      return;
    }

    const requestedQuantity =
      Number(quantity);

    const safeRequestedQuantity =
      Number.isFinite(requestedQuantity)
        ? Math.max(1, requestedQuantity)
        : 1;

    const maxStock =
      Number(product.stock) || 1;

    const safeQuantity = Math.min(
      safeRequestedQuantity,
      maxStock
    );

    /*
      Each combination of product,
      size and colour gets its own cart item.
    */

    const cartItemId = [
      product.id,
      selectedSize || "no-size",
      selectedColor || "no-color",
    ].join("-");

    setCart((currentCart) => {
      const existingItem =
        currentCart.find(
          (item) =>
            item.cartItemId ===
            cartItemId
        );

      /*
        If the product/size/colour already
        exists, increase its quantity.
      */

      if (existingItem) {
        const newQuantity =
          Math.min(
            Number(existingItem.quantity) +
              safeQuantity,
            maxStock
          );

        return currentCart.map((item) =>
          item.cartItemId ===
          cartItemId
            ? {
                ...item,
                quantity:
                  newQuantity,
              }
            : item
        );
      }

      /*
        Add a new cart item.
      */

      return [
        ...currentCart,
        {
          cartItemId,

          productId:
            product.id,

          name:
            product.name,

          price:
            product.price,

          image:
            product.image,

          category:
            product.category,

          quantity:
            safeQuantity,

          size:
            selectedSize,

          color:
            selectedColor,

          stock:
            product.stock,
        },
      ];
    });
  };

  /*
    =========================
    REMOVE FROM CART
    =========================
  */

  const removeFromCart = (
    cartItemId
  ) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) =>
          item.cartItemId !==
          cartItemId
      )
    );
  };

  /*
    =========================
    UPDATE CART QUANTITY
    =========================
  */

  const updateCartQuantity = (
    cartItemId,
    quantity
  ) => {
    setCart((currentCart) =>
      currentCart.map((item) => {
        if (
          item.cartItemId !==
          cartItemId
        ) {
          return item;
        }

        const requestedQuantity =
          Number(quantity);

        const validQuantity =
          Number.isFinite(
            requestedQuantity
          )
            ? requestedQuantity
            : 1;

        const maxStock =
          Number(item.stock) || 1;

        const safeQuantity =
          Math.max(
            1,
            Math.min(
              validQuantity,
              maxStock
            )
          );

        return {
          ...item,
          quantity:
            safeQuantity,
        };
      })
    );
  };

  /*
    =========================
    INCREASE CART QUANTITY
    =========================
  */

  const increaseCartQuantity = (
    cartItemId
  ) => {
    setCart((currentCart) =>
      currentCart.map((item) => {
        if (
          item.cartItemId !==
          cartItemId
        ) {
          return item;
        }

        const maxStock =
          Number(item.stock) || 1;

        const currentQuantity =
          Number(item.quantity) || 1;

        return {
          ...item,
          quantity: Math.min(
            currentQuantity + 1,
            maxStock
          ),
        };
      })
    );
  };

  /*
    =========================
    DECREASE CART QUANTITY
    =========================
  */

  const decreaseCartQuantity = (
    cartItemId
  ) => {
    setCart((currentCart) =>
      currentCart
        .map((item) => {
          if (
            item.cartItemId !==
            cartItemId
          ) {
            return item;
          }

          return {
            ...item,
            quantity:
              Number(item.quantity) -
              1,
          };
        })
        .filter(
          (item) =>
            Number(item.quantity) > 0
        )
    );
  };

  /*
    =========================
    CLEAR CART
    =========================
  */

  const clearCart = () => {
    setCart([]);
  };

  /*
    =========================
    CHECK IF ITEM IS IN CART
    =========================
  */

  const isInCart = (
    productId,
    selectedSize = null,
    selectedColor = null
  ) => {
    return cart.some(
      (item) =>
        String(item.productId) ===
          String(productId) &&
        (item.size || null) ===
          (selectedSize || null) &&
        (item.color || null) ===
          (selectedColor || null)
    );
  };

  /*
    =========================
    TOGGLE WISHLIST
    =========================
  */

  const toggleWishlist = (
    productId
  ) => {
    const productIdString =
      String(productId);

    setWishlist(
      (currentWishlist) => {
        const alreadyExists =
          currentWishlist.some(
            (id) =>
              String(id) ===
              productIdString
          );

        if (alreadyExists) {
          return currentWishlist.filter(
            (id) =>
              String(id) !==
              productIdString
          );
        }

        return [
          ...currentWishlist,
          productId,
        ];
      }
    );
  };

  /*
    =========================
    REMOVE FROM WISHLIST
    =========================
  */

  const removeFromWishlist = (
    productId
  ) => {
    const productIdString =
      String(productId);

    setWishlist(
      (currentWishlist) =>
        currentWishlist.filter(
          (id) =>
            String(id) !==
            productIdString
        )
    );
  };

  /*
    =========================
    CHECK WISHLIST
    =========================
  */

  const isInWishlist = (
    productId
  ) => {
    const productIdString =
      String(productId);

    return wishlist.some(
      (id) =>
        String(id) ===
        productIdString
    );
  };

  /*
    =========================
    CART ITEM COUNT
    =========================
  */

  const cartItemCount = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total +
        Number(item.quantity || 0),
      0
    );
  }, [cart]);

  /*
    =========================
    CART SUBTOTAL
    =========================
  */

  const cartSubtotal = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total +
        Number(item.price || 0) *
          Number(item.quantity || 0),
      0
    );
  }, [cart]);

  /*
    =========================
    WISHLIST COUNT
    =========================
  */

  const wishlistCount =
    wishlist.length;

  /*
    =========================
    CONTEXT VALUE
    =========================
  */

  const contextValue = useMemo(
    () => ({
      cart,
      wishlist,

      cartItemCount,
      cartSubtotal,
      wishlistCount,

      addToCart,
      removeFromCart,

      updateCartQuantity,
      increaseCartQuantity,
      decreaseCartQuantity,

      clearCart,

      isInCart,

      toggleWishlist,
      removeFromWishlist,
      isInWishlist,
    }),
    [
      cart,
      wishlist,
      cartItemCount,
      cartSubtotal,
      wishlistCount,
    ]
  );

  /*
    =========================
    SHOP PROVIDER
    =========================
  */

  return (
    <ShopContext.Provider
      value={contextValue}
    >
      {children}
    </ShopContext.Provider>
  );
}

/*
  =========================
  useShop HOOK
  =========================

  Components can now use:

  const {
    cart,
    cartSubtotal,
    addToCart,
    ...
  } = useShop();
*/

export const useShop = () => {
  const context =
    useContext(ShopContext);

  if (!context) {
    throw new Error(
      "useShop must be used inside ShopProvider"
    );
  }

  return context;
};

export default ShopContext;

