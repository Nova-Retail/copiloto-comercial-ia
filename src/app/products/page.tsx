'use client'

import { useState, useEffect, useCallback } from 'react'
import { Product } from '@/types'
import { Search, Package, Star, ChevronLeft, ChevronRight } from 'lucide-react'

function ProductCard({ product }: { product: Product }) {
  const stars = product.rating ? Math.round(product.rating) : 0

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
      {/* Categoría */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
          {product.category ?? 'Sin categoría'}
        </span>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
          product.stock > 50 ? 'bg-emerald-50 text-emerald-600' :
          product.stock > 10 ? 'bg-amber-50 text-amber-600' :
          'bg-red-50 text-red-500'
        }`}>
          Stock: {product.stock}
        </span>
      </div>

      {/* Ícono producto */}
      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-3">
        <Package size={24} className="text-gray-400" />
      </div>

      {/* Nombre */}
      <p className="font-semibold text-gray-900 text-sm leading-snug mb-2">{product.name}</p>

      {/* Rating */}
      {product.rating && (
        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              size={12}
              className={i < stars ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}
            />
          ))}
          <span className="text-xs text-gray-400 ml-1">{product.rating.toFixed(1)}</span>
        </div>
      )}

      {/* Precio */}
      <p className="text-lg font-bold text-gray-900">
        {product.price ? `$${product.price.toFixed(2)}` : 'Precio no disponible'}
      </p>
    </div>
  )
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const LIMIT = 24

  // Cargar categorías
  useEffect(() => {
    fetch('/api/products?categoriesOnly=true')
      .then((r) => r.json())
      .then(setCategories)
  }, [])

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(LIMIT),
        search,
        category: selectedCategory,
      })
      const res = await fetch(`/api/products?${params}`)
      const data = await res.json()
      setProducts(data.products)
      setTotal(data.total)
      setTotalPages(data.totalPages)
    } catch {
      // error silencioso
    } finally {
      setLoading(false)
    }
  }, [page, search, selectedCategory])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Búsqueda con debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput)
      setPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchInput])

  function handleCategory(cat: string) {
    setSelectedCategory(cat === selectedCategory ? '' : cat)
    setPage(1)
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
        <p className="text-gray-500 mt-1">Catálogo completo de productos NovaRetail</p>
      </div>

      {/* Buscador */}
      <div className="mb-4 relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar producto..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        />
        {searchInput && (
          <button
            onClick={() => { setSearchInput(''); setSearch(''); setPage(1) }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer text-xs"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filtros por categoría */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => handleCategory('')}
            className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
              selectedCategory === ''
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Todos ({total})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategory(cat)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Grid de productos */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
              <div className="h-4 bg-gray-100 rounded mb-3 w-2/3" />
              <div className="h-12 w-12 bg-gray-100 rounded-xl mb-3" />
              <div className="h-4 bg-gray-100 rounded mb-2" />
              <div className="h-6 bg-gray-100 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Package size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No se encontraron productos</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Mostrando {((page - 1) * LIMIT) + 1}–{Math.min(page * LIMIT, total)} de {total} productos
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm text-gray-600">
              Página {page} de {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
