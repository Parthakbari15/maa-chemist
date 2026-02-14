import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Dashboard from '../views/Dashboard.vue'
import Sales from '../views/Sales.vue'
import SalesDetail from '../views/SalesDetail.vue'
import AddSale from '../views/AddSale.vue'
import Purchase from '../views/Purchase.vue'
import PurchaseDetail from '../views/PurchaseDetail.vue'
import AddPurchase from '../views/AddPurchase.vue'
import Stock from '../views/Stocks.vue'
import StockDetail from '../views/StockDetail.vue'
import Agencies from '../views/Agencies.vue'
import Reports from '../views/Reports.vue'
import Login from '../views/Login.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { title: 'Dashboard' }
  },
  {
    path: '/sales',
    name: 'Sales',
    component: Sales,
    meta: { title: 'Sales Management' }
  },
  {
    path: '/sales/add',
    name: 'AddSale',
    component: AddSale,
    meta: { title: 'Add Sale' }
  },
  {
    path: '/sales/:id',
    name: 'SalesDetail',
    component: SalesDetail,
    meta: { title: 'Sales Details' }
  },
  {
    path: '/purchase',
    name: 'Purchase',
    component: Purchase,
    meta: { title: 'Purchase Management' }
  },
  {
    path: '/purchase/add',
    name: 'AddPurchase',
    component: AddPurchase,
    meta: { title: 'Add Purchase' }
  },
  {
    path: '/purchase/:id',
    name: 'PurchaseDetail',
    component: PurchaseDetail,
    meta: { title: 'Purchase Details' }
  },
  {
    path: '/stock',
    name: 'Stock',
    component: Stock,
    meta: { title: 'Stock Management' }
  },
  {
    path: '/stock/:id',
    name: 'StockDetail',
    component: StockDetail,
    meta: { title: 'Stock Details' }
  },
  {
    path: '/agencies',
    name: 'Agencies',
    component: Agencies,
    meta: { title: 'Agency Management' }
  },
  {
    path: '/reports',
    name: 'Reports',
    component: Reports,
    meta: { title: 'Reports' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} - Inventory Management`
  next()
})

export default router
