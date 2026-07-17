import { delay, http, HttpResponse } from "msw";
import { mockProducts } from "./data";

const API_PATH = "*/api";
const PAGE_SIZE = 6;
const DEMO_TOKEN = "Bearer demo-token";

let cartItems = [];
let orders = new Map();
let nextCartId = 1;
let nextOrderId = 1;

const success = (response, init) =>
  HttpResponse.json({ success: true, response }, init);

const error = (status, message) =>
  HttpResponse.json(
    { success: false, error: { message } },
    { status }
  );

const requireAuth = (request) => {
  const token = request.headers.get("authorization");
  return token === DEMO_TOKEN;
};

const findOption = (optionId) => {
  for (const product of mockProducts) {
    const option = product.options.find((item) => item.id === optionId);
    if (option) {
      return { product, option };
    }
  }
  return null;
};

const createCartResponse = () => {
  const products = mockProducts.flatMap((product) => {
    const carts = cartItems
      .filter((cart) => cart.productId === product.id)
      .map((cart) => ({
        id: cart.id,
        quantity: cart.quantity,
        option: product.options.find((option) => option.id === cart.optionId),
      }));

    return carts.length > 0
      ? [{ id: product.id, productName: product.productName, carts }]
      : [];
  });

  const totalPrice = products.reduce(
    (total, product) =>
      total +
      product.carts.reduce(
        (subtotal, cart) => subtotal + cart.option.price * cart.quantity,
        0
      ),
    0
  );

  return { products, totalPrice };
};

export const handlers = [
  http.get(`${API_PATH}/products`, async ({ request }) => {
    await delay(250);
    const page = Number(new URL(request.url).searchParams.get("page") ?? 0);
    const start = page * PAGE_SIZE;
    return success(mockProducts.slice(start, start + PAGE_SIZE));
  }),

  http.get(`${API_PATH}/products/:id`, async ({ params }) => {
    await delay(200);
    const product = mockProducts.find((item) => item.id === Number(params.id));
    return product ? success(product) : error(404, "상품을 찾을 수 없습니다.");
  }),

  http.post(`${API_PATH}/login`, async () => {
    await delay(300);
    return success(null, { headers: { Authorization: DEMO_TOKEN } });
  }),

  http.post(`${API_PATH}/join`, async () => {
    await delay(300);
    return success(null, { headers: { Authorization: DEMO_TOKEN } });
  }),

  http.post(`${API_PATH}/check`, () => success({ available: true })),

  http.get(`${API_PATH}/carts`, async ({ request }) => {
    await delay(200);
    if (!requireAuth(request)) {
      return error(401, "로그인이 필요한 서비스입니다.");
    }
    return success(createCartResponse());
  }),

  http.post(`${API_PATH}/carts/add`, async ({ request }) => {
    await delay(250);
    if (!requireAuth(request)) {
      return error(401, "로그인이 필요한 서비스입니다.");
    }

    const items = await request.json();
    for (const item of items) {
      const found = findOption(item.optionId);
      if (!found) {
        return error(404, "상품 옵션을 찾을 수 없습니다.");
      }
      if (cartItems.some((cart) => cart.optionId === item.optionId)) {
        return error(400, "이미 장바구니에 담긴 옵션입니다.");
      }
      cartItems.push({
        id: nextCartId++,
        productId: found.product.id,
        optionId: item.optionId,
        quantity: item.quantity,
      });
    }

    return success(createCartResponse());
  }),

  http.post(`${API_PATH}/carts/update`, async ({ request }) => {
    await delay(250);
    if (!requireAuth(request)) {
      return error(401, "로그인이 필요한 서비스입니다.");
    }

    const updates = await request.json();
    updates.forEach((update) => {
      const cart = cartItems.find((item) => item.id === update.cartId);
      if (cart) {
        cart.quantity = update.quantity;
      }
    });
    cartItems = cartItems.filter((cart) => cart.quantity > 0);
    return success(createCartResponse());
  }),

  http.post(`${API_PATH}/orders/save`, async ({ request }) => {
    await delay(300);
    if (!requireAuth(request)) {
      return error(401, "로그인이 필요한 서비스입니다.");
    }

    const cart = createCartResponse();
    if (cart.products.length === 0) {
      return error(400, "주문할 상품이 없습니다.");
    }

    const id = nextOrderId++;
    const products = cart.products.map((product) => ({
      productName: product.productName,
      items: product.carts.map((item) => ({
        id: item.id,
        optionName: item.option.optionName,
        quantity: item.quantity,
        price: item.option.price * item.quantity,
      })),
    }));
    orders.set(id, { id, products, totalPrice: cart.totalPrice });
    cartItems = [];
    return success({ id });
  }),

  http.get(`${API_PATH}/orders/:id`, async ({ request, params }) => {
    await delay(200);
    if (!requireAuth(request)) {
      return error(401, "로그인이 필요한 서비스입니다.");
    }
    const order = orders.get(Number(params.id));
    return order ? success(order) : error(404, "주문 내역을 찾을 수 없습니다.");
  }),
];
