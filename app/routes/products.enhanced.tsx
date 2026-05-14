'use client';
import { useLoaderData } from '@remix-run/react';
import { ProductDetailEnhanced } from '~/components/Product/ProductDetailEnhanced';
import { useCart } from '~/lib/CartContext';

interface LoaderData {
  product?: {
    id: string;
    name: string;
    price: number;
    descriptions?: { ZH?: string; EN?: string };
    material: string;
    stock: number;
  };
}

export default function ProductPageEnhanced() {
  const { product } = useLoaderData<LoaderData>();
  const { addToCart } = useCart();

  if (!product) {
    return (
      <div className="bg-void min-h-dvh-safe flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-display-xl font-black uppercase text-y2k-pink mb-4">
            产品未找到
          </h1>
          <p className="text-data text-titanium/70">
            这件珍品不在我们的目录中。
          </p>
        </div>
      </div>
    );
  }

  return (
    <ProductDetailEnhanced
      product={{
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.descriptions?.ZH || product.descriptions?.EN || '',
        material: product.material,
        stock: product.stock,
        totalStock: 100,
        soldCount: Math.floor(Math.random() * 50),
        launchDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      }}
      onAddToCart={(item: Record<string, unknown>) => {
        addToCart({
          id: item.productId as string,
          name: item.productName as string,
          price: product.price,
          material: item.material as string,
        });
      }}
    />
  );
}
