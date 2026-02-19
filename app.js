// app.js - Lumière E-commerce Frontend
// Senior Frontend Architecture | Tailwind CSS v4 | Vanilla JS

// API module - data fetching and transformation
const API = {
  base: "https://fakestoreapi.com/products",

  async fetchProducts() {
    try {
      const res = await fetch(this.base);
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      return data.map(this.transformProduct);
    } catch (err) {
      console.error("API error:", err);
      return [];
    }
  },

  // transform API response to internal format
  transformProduct(p) {
    return {
      id: p.id,
      name: p.title,
      price: p.price,
      description: p.description,
      category: p.category,
      image: p.image,
      images: [p.image],
      rating: p.rating?.rate || 0,
      reviews: p.rating?.count || 0,
      featured: p.rating?.rate > 4.0,
      new: p.rating?.count > 100,
      badge: p.rating?.rate > 4.5 ? "Bestseller" : null,
      colors: [],
    };
  },

  // fake testimonials API
  async fetchTestimonials() {
    return [
      {
        id: 1,
        name: "Sarah Johnson",
        role: "Designer",
        content:
          "Lumière products have transformed my daily routine. The quality and attention to detail is unmatched in the market.",
        rating: 5,
        avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      },
      {
        id: 2,
        name: "Michael Chen",
        role: "Architect",
        content:
          "I've been a loyal customer for 3 years now. Their customer service is exceptional and their products always exceed expectations.",
        rating: 5,
        avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      },
      {
        id: 3,
        name: "Amina Hassan",
        role: "Entrepreneur",
        content:
          "The craftsmanship and ethical approach of Lumière is exactly what I look for in a brand. Highly recommend their home collection.",
        rating: 4.5,
        avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      },
    ];
  },

  // fake blog API
  async fetchBlogPosts() {
    return [
      {
        id: 1,
        title: "The Art of Slow Living",
        excerpt:
          "Discover how intentionally designed products can help you create moments of calm in your busy life.",
        image: "https://picsum.photos/seed/blog1/600/400",
        date: "2023-10-15",
        readTime: "5 min",
      },
      {
        id: 2,
        title: "Sustainable Materials Guide",
        excerpt:
          "Learn about the eco-friendly materials we use in our products and their environmental impact.",
        image: "https://picsum.photos/seed/blog2/600/400",
        date: "2023-10-05",
        readTime: "8 min",
      },
      {
        id: 3,
        title: "Home Styling Tips",
        excerpt:
          "Professional tips on how to incorporate premium products into your living space for maximum impact.",
        image: "https://picsum.photos/seed/blog3/600/400",
        date: "2023-09-28",
        readTime: "6 min",
      },
    ];
  },
};

// STORE - application state
const STORE = {
  state: {
    products: [],
    newProducts: [],
    featuredProducts: [],
    categories: [],
    cart: [],
    search: "",
    category: "all",
    sort: "default",
    lang: "en",
    currency: "USD",
    testimonials: [],
    blogPosts: [],
    loading: false,
  },

  get(key) {
    return this.state[key];
  },

  set(key, value) {
    this.state[key] = value;
    return this;
  },

  loadPersisted() {
    const cart = localStorage.getItem("lumiere_cart");
    const lang = localStorage.getItem("lumiere_lang");
    const currency = localStorage.getItem("lumiere_currency");

    if (cart) this.state.cart = JSON.parse(cart);
    if (lang) this.state.lang = lang;
    if (currency) this.state.currency = currency;
  },

  persist(key) {
    if (key === "cart") {
      localStorage.setItem("lumiere_cart", JSON.stringify(this.state.cart));
    } else if (key === "lang") {
      localStorage.setItem("lumiere_lang", this.state.lang);
    } else if (key === "currency") {
      localStorage.setItem("lumiere_currency", this.state.currency);
    }
  },
};

// CURRENCY - conversion and formatting
const CURRENCY = {
  rates: {
    USD: { symbol: "$", rate: 1, name: "US Dollar" },
    EGP: { symbol: "E£", rate: 30.9, name: "Egyptian Pound" },
    EUR: { symbol: "€", rate: 0.92, name: "Euro" },
    GBP: { symbol: "£", rate: 0.79, name: "British Pound" },
    SAR: { symbol: "ر.س", rate: 3.75, name: "Saudi Riyal" },
    AED: { symbol: "د.إ", rate: 3.67, name: "UAE Dirham" },
  },

  format(amount, code) {
    const config = this.rates[code] || this.rates.USD;
    const converted = amount * config.rate;
    return `${config.symbol}${converted.toFixed(2)}`;
  },

  getCode() {
    return STORE.get("currency");
  },

  setCode(code) {
    if (this.rates[code]) {
      STORE.set("currency", code);
      STORE.persist("currency");
      return true;
    }
    return false;
  },
};

// I18N - translations
const I18N = {
  strings: {
    en: {
      "nav.products": "Products",
      "nav.categories": "Categories",
      "nav.about": "About",
      "nav.testimonials": "Testimonials",
      "nav.blog": "Blog",
      "search.placeholder": "Search products...",
      "hero.title": "Elevate Your Everyday",
      "hero.subtitle":
        "Discover curated premium products designed for quality, comfort, and timeless style.",
      "hero.shop": "Shop Now",
      "hero.learn": "Learn More",
      "sections.new": "New Arrivals",
      "sections.featured": "Featured Products",
      "sections.categories": "Shop by Category",
      "sections.all": "All Products",
      "sections.testimonials": "Customer Reviews",
      "sections.blog": "Latest Articles",
      "filters.all": "All Categories",
      "sort.default": "Sort by",
      "sort.price-asc": "Price: Low to High",
      "sort.price-desc": "Price: High to Low",
      "sort.rating": "Top Rated",
      loading: "Loading products...",
      "about.title": "Crafted for Quality",
      "about.desc":
        "Lumière partners with artisans and ethical manufacturers to bring you products that blend timeless design with everyday functionality. Every item is selected for its materials, craftsmanship, and attention to detail.",
      "about.point1": "Ethically sourced materials",
      "about.point2": "Rigorous quality testing",
      "about.point3": "Customer-first support",
      "about.products": "Products",
      "about.satisfaction": "Satisfaction",
      "about.support": "Support",
      "newsletter.title": "Stay in the Loop",
      "newsletter.desc":
        "Subscribe for exclusive offers, early access to new collections, and style inspiration.",
      "newsletter.placeholder": "your@email.com",
      "newsletter.subscribe": "Subscribe",
      "footer.rights": "All rights reserved.",
      "cart.title": "Your Cart",
      "cart.empty": "Your cart is empty.",
      "cart.total": "Total",
      "cart.checkout": "Proceed to Checkout",
      "cart.add": "Add to Cart",
      "cart.remove": "Remove",
      "modal.view": "View Details",
      "product.rating": "rating",
      "new.view": "View All",
      "blog.view": "View All",
      "product.new": "New",
      "blog.read": "Read More",
    },
    ar: {
      "nav.products": "المنتجات",
      "nav.categories": "الفئات",
      "nav.about": "من نحن",
      "nav.testimonials": "الآراء",
      "nav.blog": "المدونة",
      "search.placeholder": "ابحث عن منتجات...",
      "hero.title": "ارفع مستوى يومك",
      "hero.subtitle":
        "اكتشف منتجات متميزة مختارة بعناية تجمع بين الجودة والراحة والأناقة الخالدة.",
      "hero.shop": "تسوق الآن",
      "hero.learn": "اعرف المزيد",
      "sections.new": "الوافد الجديد",
      "sections.featured": "منتجات مميزة",
      "sections.categories": "تسوق حسب الفئة",
      "sections.all": "جميع المنتجات",
      "sections.testimonials": "آراء العملاء",
      "sections.blog": "أحدث المقالات",
      "filters.all": "جميع الفئات",
      "sort.default": "ترتيب حسب",
      "sort.price-asc": "السعر: من الأقل للأعلى",
      "sort.price-desc": "السعر: من الأعلى للأقل",
      "sort.rating": "الأعلى تقييماً",
      loading: "جاري تحميل المنتجات...",
      "about.title": "صُنعت للجودة",
      "about.desc":
        "تتعاون لوميير مع الحرفيين والمصنعين الأخلاقيين لتقديم منتجات تجمع بين التصميم الخالد والوظائف اليومية. يتم اختيار كل عنصر لمواده وجودته وانتباهه للتفاصيل.",
      "about.point1": "مواد مُوردة بشكل أخلاقي",
      "about.point2": "اختبار جودة صارم",
      "about.point3": "دعم يركز على العميل",
      "about.products": "منتج",
      "about.satisfaction": "رضا",
      "about.support": "دعم",
      "newsletter.title": "ابقَ على اطلاع",
      "newsletter.desc":
        "اشترك للحصول على عروض حصرية ووصول مبكر للمجموعات الجديدة وإلهام الأناقة.",
      "newsletter.placeholder": "بريدك@الإيميل.com",
      "newsletter.subscribe": "اشترك",
      "footer.rights": "جميع الحقوق محفوظة.",
      "cart.title": "سلة التسوق",
      "cart.empty": "سلتك فارغة.",
      "cart.total": "المجموع",
      "cart.checkout": "إتمام الشراء",
      "cart.add": "أضف للسلة",
      "cart.remove": "إزالة",
      "modal.view": "عرض التفاصيل",
      "product.rating": "تقييم",
      "new.view": "عرض الكل",
      "blog.view": "عرض الكل",
      "product.new": "جديد",
      "blog.read": "اقرأ المزيد",
    },
  },

  t(key) {
    const lang = STORE.get("lang");
    return this.strings[lang][key] || key;
  },

  placeholder(key) {
    return this.t(key);
  },
};

// LANGUAGE - RTL/LTR switching with dropdown
const LANGUAGE = {
  init() {
    const lang = STORE.get("lang");
    this.set(lang);
    this.bindDropdown();
  },

  set(lang) {
    const html = document.documentElement;
    html.setAttribute("lang", lang);
    html.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    STORE.set("lang", lang);
    STORE.persist("lang");

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      el.textContent = I18N.t(key);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.dataset.i18nPlaceholder;
      el.placeholder = I18N.placeholder(key);
    });

    const langBtn = document.getElementById("lang-current");
    if (langBtn) {
      langBtn.textContent = lang.toUpperCase();
    }

    // Re-render UI after language change
    UI.renderAll();
  },

  bindDropdown() {
    const btn = document.getElementById("lang-toggle");
    const menu = document.getElementById("lang-menu");

    if (!btn || !menu) return;

    // Toggle dropdown
    btn.addEventListener("click", () => {
      menu.classList.toggle("open");
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (!btn.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove("open");
      }
    });

    // Language selection
    document.querySelectorAll("#lang-menu .dropdown-item").forEach((item) => {
      item.addEventListener("click", () => {
        const lang = item.dataset.lang;
        if (lang) {
          this.set(lang);
          menu.classList.remove("open");
        }
      });
    });
  },
};

// UI - rendering helpers with animations
const UI = {
  // create product card element
  createProductCard(product) {
    const frag = document.createDocumentFragment();
    const card = document.createElement("article");
    card.className =
      "card group cursor-pointer opacity-0 transform translate-y-4";
    card.setAttribute("data-id", product.id);
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");

    const price = CURRENCY.format(product.price, CURRENCY.getCode());

    card.innerHTML = `
      <div class="relative aspect-square overflow-hidden rounded-t-xl bg-slate-900/50">
        <img 
          src="${product.image}" 
          alt="${product.name}" 
          class="product-image"
          loading="lazy"
        />
        ${product.badge ? `<span class="absolute top-3 start-3 bg-gradient-to-r from-amber-400 to-amber-600 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">${product.badge}</span>` : ""}
        ${product.new ? `<span class="absolute top-3 end-3 bg-slate-800 text-amber-400 text-xs font-bold px-2 py-1 rounded">${I18N.t("product.new")}</span>` : ""}
        <button 
          class="add-to-cart absolute end-3 bottom-3 bg-slate-800 text-primary p-2 rounded-full shadow hover:scale-105 transition-transform cursor-pointer border border-amber-200/20"
          aria-label="Add ${product.name} to cart"
          data-id="${product.id}"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
        </button>
      </div>
      <div class="p-4 space-y-2">
        <h3 class="font-display font-medium text-primary line-clamp-1">${product.name}</h3>
        <div class="flex items-center justify-between">
          <span class="text-amber-400 font-semibold">${price}</span>
          <div class="flex items-center gap-1 text-sm text-muted">
            <svg class="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            <span>${product.rating.toFixed(1)}</span>
          </div>
        </div>
        <button 
          class="view-details w-full mt-2 btn-secondary text-sm py-2 cursor-pointer"
          data-id="${product.id}"
        >${I18N.t("modal.view")}</button>
      </div>
    `;

    frag.appendChild(card);
    return frag;
  },

  // render product grid with animations
  renderProducts(products, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const frag = document.createDocumentFragment();
    products.forEach((p, index) => {
      const card = this.createProductCard(p);
      frag.appendChild(card);

      // Add animation delay for staggered effect
      setTimeout(() => {
        const cardEl = container.children[index];
        if (cardEl) {
          cardEl.classList.remove("opacity-0", "translate-y-4");
          cardEl.classList.add("animate-fade-in");
        }
      }, index * 50);
    });

    container.innerHTML = "";
    container.appendChild(frag);

    // bind events to new cards
    container.querySelectorAll(".add-to-cart").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        e.currentTarget.classList.add("animate-pulse");
        setTimeout(
          () => e.currentTarget.classList.remove("animate-pulse"),
          1000,
        );

        const id = parseInt(e.currentTarget.dataset.id);
        CART.add(id);
      });
    });

    container.querySelectorAll(".view-details").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = parseInt(e.currentTarget.dataset.id);
        MODAL.open(id);
      });
    });

    // make cards clickable for modal
    container.querySelectorAll("article[data-id]").forEach((card) => {
      card.addEventListener("click", () => {
        const id = parseInt(card.dataset.id);
        MODAL.open(id);
      });
      card.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          const id = parseInt(card.dataset.id);
          MODAL.open(id);
        }
      });
    });
  },

  // render featured section
  renderFeatured() {
    const featured = STORE.get("featuredProducts");
    this.renderProducts(featured, "featured-grid");
  },

  // render new arrivals section
  renderNewArrivals() {
    const newProducts = STORE.get("newProducts");
    this.renderProducts(newProducts, "new-arrivals-grid");
  },

  // render categories
  renderCategories() {
    const categories = STORE.get("categories");
    const container = document.getElementById("categories-grid");
    if (!container) return;

    const frag = document.createDocumentFragment();
    categories.forEach((cat, index) => {
      const item = document.createElement("div");
      item.className =
        "card p-4 text-center cursor-pointer opacity-0 transform translate-y-4";
      item.setAttribute("data-category", cat);
      item.style.transitionDelay = `${index * 50}ms`;

      item.innerHTML = `
        <div class="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-amber-900/30 to-slate-800 flex items-center justify-center mb-3">
          <svg class="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
        </div>
        <span class="font-medium text-primary capitalize">${cat}</span>
      `;

      item.addEventListener("click", () => {
        FILTER.setCategory(cat);
        document
          .getElementById("products")
          .scrollIntoView({ behavior: "smooth" });
      });

      frag.appendChild(item);

      // Add animation delay
      setTimeout(() => {
        item.classList.remove("opacity-0", "translate-y-4");
        item.classList.add("animate-fade-in");
      }, index * 50);
    });

    container.innerHTML = "";
    container.appendChild(frag);
  },

  // render testimonials
  renderTestimonials() {
    const testimonials = STORE.get("testimonials");
    const container = document.getElementById("testimonials-grid");
    if (!container) return;

    const frag = document.createDocumentFragment();

    testimonials.forEach((testimonial, index) => {
      const item = document.createElement("div");
      item.className = "card p-6 opacity-0 transform translate-y-4";
      item.style.transitionDelay = `${index * 50}ms`;

      // Rating stars
      let stars = "";
      const fullStars = Math.floor(testimonial.rating);
      const hasHalf = testimonial.rating % 1 !== 0;

      for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
          stars += `<svg class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`;
        } else if (i === fullStars && hasHalf) {
          stars += `<svg class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`;
        } else {
          stars += `<svg class="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>`;
        }
      }

      item.innerHTML = `
        <div class="flex items-center gap-2 mb-3">
          <div class="w-10 h-10 rounded-full overflow-hidden border border-amber-200/20">
            <img src="${testimonial.avatar}" alt="${testimonial.name}" class="w-full h-full object-cover" />
          </div>
          <div>
            <h4 class="font-medium text-primary">${testimonial.name}</h4>
            <div class="text-xs text-muted">${testimonial.role}</div>
          </div>
        </div>
        <div class="flex mb-2">${stars}</div>
        <p class="text-secondary italic">"${testimonial.content}"</p>
      `;

      frag.appendChild(item);

      // Add animation delay
      setTimeout(() => {
        item.classList.remove("opacity-0", "translate-y-4");
        item.classList.add("animate-fade-in");
      }, index * 50);
    });

    container.innerHTML = "";
    container.appendChild(frag);
  },

  // render blog posts
  renderBlog() {
    const blogPosts = STORE.get("blogPosts");
    const container = document.getElementById("blog-grid");
    if (!container) return;

    const frag = document.createDocumentFragment();

    blogPosts.forEach((post, index) => {
      const item = document.createElement("div");
      item.className = "opacity-0 transform translate-y-4";
      item.style.transitionDelay = `${index * 50}ms`;

      item.innerHTML = `
        <div class="card overflow-hidden group">
          <div class="relative aspect-video overflow-hidden">
            <img 
              src="${post.image}" 
              alt="${post.title}" 
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <div class="p-5">
            <div class="flex items-center gap-2 text-sm text-muted mb-2">
              <span>${this.formatDate(post.date)}</span>
              <span>•</span>
              <span>${post.readTime}</span>
            </div>
            <h3 class="font-display font-medium text-primary text-lg mb-2 group-hover:text-amber-400 transition-colors">${post.title}</h3>
            <p class="text-secondary mb-4">${post.excerpt}</p>
            <a href="#" class="text-amber-400 hover:text-amber-300 font-medium transition-colors">${I18N.t("blog.read")}</a>
          </div>
        </div>
      `;

      frag.appendChild(item);

      // Add animation delay
      setTimeout(() => {
        item.classList.remove("opacity-0", "translate-y-4");
        item.classList.add("animate-fade-in");
      }, index * 50);
    });

    container.innerHTML = "";
    container.appendChild(frag);
  },

  // format date for blog posts
  formatDate(dateString) {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(STORE.get("lang"), options);
  },

  // render about strip dynamically
  renderAboutStrip() {
    const items = ABOUT.items;
    const container = document.getElementById("about-strip");
    if (!container) return;

    const frag = document.createDocumentFragment();
    items.forEach((item, index) => {
      const div = document.createElement("div");
      div.className =
        "p-4 bg-slate-900/70 rounded-xl border border-amber-100/10 opacity-0 transform translate-y-4";
      div.style.transitionDelay = `${index * 50}ms`;

      div.innerHTML = `
        <div class="font-display text-3xl font-bold text-gradient mb-1">${item.value}</div>
        <div class="text-secondary">${I18N.t(item.labelKey)}</div>
      `;

      frag.appendChild(div);

      // Add animation delay
      setTimeout(() => {
        div.classList.remove("opacity-0", "translate-y-4");
        div.classList.add("animate-fade-in");
      }, index * 50);
    });

    container.innerHTML = "";
    container.appendChild(frag);
  },

  // update category filter options
  renderCategoryFilter() {
    const select = document.getElementById("category-filter");
    if (!select) return;

    while (select.options.length > 1) {
      select.remove(1);
    }

    STORE.get("categories").forEach((cat) => {
      const opt = document.createElement("option");
      opt.value = cat;
      opt.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
      select.appendChild(opt);
    });
  },

  // re-render all dynamic sections
  renderAll() {
    this.renderFeatured();
    this.renderNewArrivals();
    this.renderCategories();
    this.renderAboutStrip();
    this.renderCategoryFilter();
    this.renderTestimonials();
    this.renderBlog();
    PRODUCTS.applyFilters();
    CART.render();
  },
};

// PRODUCTS - filtering and sorting
const PRODUCTS = {
  init() {
    this.bindFilters();
  },

  bindFilters() {
    const catFilter = document.getElementById("category-filter");
    if (catFilter) {
      catFilter.addEventListener("change", (e) => {
        FILTER.setCategory(e.target.value);
      });
    }

    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        FILTER.setSort(e.target.value);
      });
    }
  },

  applyFilters() {
    const { products, search, category, sort } = STORE.state;

    let result = [...products];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      );
    }

    if (category !== "all") {
      result = result.filter((p) => p.category === category);
    }

    if (sort === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    STORE.set("filteredProducts", result);
    UI.renderProducts(result, "product-grid");
  },
};

// FILTER - state helpers
const FILTER = {
  setCategory(cat) {
    STORE.set("category", cat);
    const el = document.getElementById("category-filter");
    if (el) el.value = cat;
    PRODUCTS.applyFilters();
  },

  setSort(sort) {
    STORE.set("sort", sort);
    PRODUCTS.applyFilters();
  },
};

// SEARCH - input handling
const SEARCH = {
  init() {
    const inputs = ["search-input", "search-input-mobile"];
    const clears = ["search-clear", "search-clear-mobile"];

    inputs.forEach((id, idx) => {
      const input = document.getElementById(id);
      const clearBtn = document.getElementById(clears[idx]);

      if (!input) return;

      input.addEventListener("input", (e) => {
        const val = e.target.value.trim();
        STORE.set("search", val);

        if (clearBtn) {
          clearBtn.classList.toggle("hidden", !val);
        }

        clearTimeout(this._timer);
        this._timer = setTimeout(() => {
          PRODUCTS.applyFilters();
        }, 250);
      });

      if (clearBtn) {
        clearBtn.addEventListener("click", () => {
          input.value = "";
          STORE.set("search", "");
          clearBtn.classList.add("hidden");
          PRODUCTS.applyFilters();
          input.focus();
        });
      }
    });
  },

  _timer: null,
};

// CART - cart logic and rendering
const CART = {
  add(productId) {
    const products = STORE.get("products");
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const cart = STORE.get("cart");
    const existing = cart.find((item) => item.id === productId);

    if (existing) {
      existing.qty++;
    } else {
      cart.push({ ...product, qty: 1 });
    }

    STORE.set("cart", cart);
    STORE.persist("cart");
    this.render();
    this.openDrawer();
  },

  remove(productId) {
    let cart = STORE.get("cart");
    cart = cart.filter((item) => item.id !== productId);
    STORE.set("cart", cart);
    STORE.persist("cart");
    this.render();
  },

  updateQty(productId, delta) {
    const cart = STORE.get("cart");
    const item = cart.find((i) => i.id === productId);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
      this.remove(productId);
      return;
    }

    STORE.set("cart", cart);
    STORE.persist("cart");
    this.render();
  },

  total() {
    return STORE.get("cart").reduce(
      (sum, item) => sum + item.price * item.qty,
      0,
    );
  },

  render() {
    const cart = STORE.get("cart");
    const container = document.getElementById("cart-items");
    const empty = document.getElementById("cart-empty");
    const totalEl = document.getElementById("cart-total");
    const countEl = document.getElementById("cart-count");

    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    if (countEl) {
      countEl.textContent = count;
      countEl.classList.toggle("hidden", count === 0);
    }

    if (cart.length === 0) {
      if (empty) empty.classList.remove("hidden");
      if (container) {
        container.innerHTML = "";
        if (empty) container.appendChild(empty);
      }
    } else {
      if (empty) empty.classList.add("hidden");
      if (container) {
        const frag = document.createDocumentFragment();

        cart.forEach((item) => {
          const price = CURRENCY.format(item.price, CURRENCY.getCode());
          const div = document.createElement("div");
          div.className =
            "flex gap-4 p-3 bg-slate-900/70 rounded-lg border border-amber-100/10 opacity-0 transform translate-x-4";
          div.dataset.id = item.id;

          div.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-contain rounded bg-slate-900/50 p-2" loading="lazy" />
            <div class="flex-1 min-w-0">
              <h4 class="font-medium text-primary truncate">${item.name}</h4>
              <div class="text-amber-400 font-semibold mt-1">${price}</div>
              <div class="flex items-center gap-2 mt-2">
                <button class="qty-btn w-7 h-7 rounded border border-amber-300/50 flex items-center justify-center cursor-pointer hover:bg-amber-500/10 text-primary" data-id="${item.id}" data-delta="-1">−</button>
                <span class="w-8 text-center text-primary">${item.qty}</span>
                <button class="qty-btn w-7 h-7 rounded border border-amber-300/50 flex items-center justify-center cursor-pointer hover:bg-amber-500/10 text-primary" data-id="${item.id}" data-delta="1">+</button>
                <button class="remove-btn ms-auto text-muted hover:text-amber-400 cursor-pointer" data-id="${item.id}" aria-label="Remove item">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
              </div>
            </div>
          `;

          frag.appendChild(div);

          // Add animation delay
          setTimeout(() => {
            div.classList.remove("opacity-0", "translate-x-4");
            div.classList.add("animate-fade-in");
          }, 100);
        });

        container.innerHTML = "";
        container.appendChild(frag);

        container.querySelectorAll(".qty-btn").forEach((btn) => {
          btn.addEventListener("click", (e) => {
            const id = parseInt(e.currentTarget.dataset.id);
            const delta = parseInt(e.currentTarget.dataset.delta);
            CART.updateQty(id, delta);
          });
        });

        container.querySelectorAll(".remove-btn").forEach((btn) => {
          btn.addEventListener("click", (e) => {
            const id = parseInt(e.currentTarget.dataset.id);
            CART.remove(id);
          });
        });
      }
    }

    if (totalEl) {
      totalEl.textContent = CURRENCY.format(this.total(), CURRENCY.getCode());
    }
  },

  openDrawer() {
    const drawer = document.getElementById("cart-drawer");
    const overlay = document.getElementById("cart-overlay");
    if (drawer) {
      drawer.classList.add("open");
      drawer.classList.add("animate-slide-in");
    }
    if (overlay) overlay.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  },

  closeDrawer() {
    const drawer = document.getElementById("cart-drawer");
    const overlay = document.getElementById("cart-overlay");
    if (drawer) {
      drawer.classList.remove("open");
      drawer.classList.remove("animate-slide-in");
    }
    if (overlay) overlay.classList.add("hidden");
    document.body.style.overflow = "";
  },

  bindEvents() {
    const cartToggle = document.getElementById("cart-toggle");
    if (cartToggle) {
      cartToggle.addEventListener("click", () => {
        this.openDrawer();
      });
    }

    const cartClose = document.getElementById("cart-close");
    if (cartClose) {
      cartClose.addEventListener("click", () => {
        this.closeDrawer();
      });
    }
    const overlay = document.getElementById("cart-overlay");
    if (overlay) {
      overlay.addEventListener("click", () => {
        this.closeDrawer();
      });
    }

    const checkoutBtn = document.getElementById("checkout-btn");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", () => {
        const cart = STORE.get("cart");
        if (cart.length === 0) return;

        const total = CURRENCY.format(this.total(), CURRENCY.getCode());
        alert(
          `Checkout simulation:\n\nItems: ${cart.reduce((s, i) => s + i.qty, 0)}\nTotal: ${total}\n\nThank you for your order!`,
        );
        STORE.set("cart", []);
        STORE.persist("cart");
        this.render();
        this.closeDrawer();
      });
    }
  },
};

// MODAL - product details
const MODAL = {
  open(productId) {
    const products = STORE.get("products");
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const content = document.getElementById("modal-content");
    if (!content) return;

    const price = CURRENCY.format(product.price, CURRENCY.getCode());

    content.innerHTML = `
      <div class="grid md:grid-cols-2 gap-8">
        <div class="aspect-square rounded-xl overflow-hidden bg-slate-900/70 border border-amber-100/10 flex items-center justify-center">
          <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy" />
        </div>
        <div class="space-y-4">
          <h3 id="modal-title" class="font-display text-2xl font-bold text-gradient">${product.name}</h3>
          <div class="flex items-center gap-3">
            <span class="text-2xl font-bold text-amber-400">${price}</span>
            <div class="flex items-center gap-1 text-sm text-muted">
              <svg class="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              <span>${product.rating.toFixed(1)} (${product.reviews} ${I18N.t("product.rating")})</span>
            </div>
          </div>
          <p class="text-secondary leading-relaxed">${product.description}</p>
          <div class="pt-4 border-t border-amber-100/10">
            <button id="modal-add-cart" class="btn-primary w-full cursor-pointer" data-id="${product.id}">${I18N.t("cart.add")}</button>
          </div>
        </div>
      </div>
    `;

    const addBtn = document.getElementById("modal-add-cart");
    if (addBtn) {
      addBtn.addEventListener("click", () => {
        CART.add(product.id);
        this.close();
      });
    }

    const modal = document.getElementById("product-modal");
    if (modal) {
      modal.classList.remove("hidden");
      setTimeout(() => {
        modal.style.opacity = "1";
      }, 50);
    }
    document.body.style.overflow = "hidden";
  },

  close() {
    const modal = document.getElementById("product-modal");
    if (modal) {
      modal.style.opacity = "0";
      setTimeout(() => {
        modal.classList.add("hidden");
      }, 300);
    }
    document.body.style.overflow = "";
  },

  bindEvents() {
    const closeBtn = document.getElementById("modal-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.close());
    }
    const overlay = document.getElementById("modal-overlay");
    if (overlay) {
      overlay.addEventListener("click", () => this.close());
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.close();
        CART.closeDrawer();
      }
    });
  },
};

// ABOUT - dynamic content
const ABOUT = {
  items: [
    { value: "24+", labelKey: "about.products" },
    { value: "98%", labelKey: "about.satisfaction" },
    { value: "24/7", labelKey: "about.support" },
  ],
};

// CHECKOUT - simulation only
const CHECKOUT = {
  init() {
    const form = document.getElementById("newsletter-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        const msg = document.getElementById("newsletter-msg");

        if (email) {
          msg.textContent = "Thank you for subscribing!";
          msg.className = "mt-3 text-sm text-amber-400 min-h-[1.25rem]";
          e.target.reset();
          setTimeout(() => {
            msg.textContent = "";
            msg.className = "mt-3 text-sm text-muted min-h-[1.25rem]";
          }, 4000);
        }
      });
    }
  },
};

// CURRENCY UI - dropdown handling
const CURRENCY_UI = {
  init() {
    this.updateDisplay();
    this.bindDropdown();
  },

  updateDisplay() {
    const el = document.getElementById("currency-current");
    if (el) {
      el.textContent = CURRENCY.getCode();
    }
  },

  bindDropdown() {
    const btn = document.getElementById("currency-toggle");
    const menu = document.getElementById("currency-menu");

    if (!btn || !menu) return;

    // Toggle dropdown
    btn.addEventListener("click", () => {
      menu.classList.toggle("open");
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (!btn.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove("open");
      }
    });

    // Currency selection
    document
      .querySelectorAll("#currency-menu .dropdown-item")
      .forEach((item) => {
        item.addEventListener("click", () => {
          const currency = item.dataset.currency;
          if (currency) {
            CURRENCY.setCode(currency);
            this.updateDisplay();
            menu.classList.remove("open");
            // Re-render all prices
            UI.renderAll();
          }
        });
      });
  },
};

// INIT - bootstrap app
const INIT = {
  async init() {
    STORE.loadPersisted();

    LANGUAGE.init();
    CURRENCY_UI.init();

    const yearEl = document.getElementById("year");
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }

    const loading = document.getElementById("loading");
    if (loading) loading.classList.remove("hidden");

    // Fetch all data
    const [products, testimonials, blogPosts] = await Promise.all([
      API.fetchProducts(),
      API.fetchTestimonials(),
      API.fetchBlogPosts(),
    ]);

    // Process products
    STORE.set("products", products);
    STORE.set("newProducts", products.filter((p) => p.new).slice(0, 4));
    STORE.set(
      "featuredProducts",
      products.filter((p) => p.featured).slice(0, 4),
    );

    // Process categories
    const categories = [...new Set(products.map((p) => p.category))];
    STORE.set("categories", categories);

    // Set testimonials and blog
    STORE.set("testimonials", testimonials);
    STORE.set("blogPosts", blogPosts);

    // Initial render
    STORE.set("filteredProducts", products);
    UI.renderAll();

    if (loading) loading.classList.add("hidden");

    // Bind remaining events
    SEARCH.init();
    PRODUCTS.init();
    CART.bindEvents();
    CART.render();
    MODAL.bindEvents();
    CHECKOUT.init();

    // Add scroll animations
    this.initScrollAnimations();
  },

  initScrollAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
      },
    );

    // Observe sections for scroll animations
    document.querySelectorAll(".section-bg").forEach((section) => {
      section.classList.add("opacity-0", "transform", "translate-y-4");
      observer.observe(section);
    });
  },
};

document.addEventListener("DOMContentLoaded", () => {
  INIT.init();
});
