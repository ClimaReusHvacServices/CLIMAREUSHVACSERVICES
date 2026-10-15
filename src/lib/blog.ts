import { Prisma } from "@prisma/client";
import { db } from "@/db";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  coverGradient: string;
  date: string;
  category: string;
  readTime: number;
  content: string;
  showComparisonTable: boolean;
  comparisonTable: ComparisonTableData | null;
  tipText: string | null;
}

export type ComparisonTableData = {
  title: string;
  headers: [string, string, string];
  rows: Array<[string, string, string]>;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "split-o-multisplit-cual-conviene-mas",
    title: "Split o multisplit: ¿Cuál conviene más para tu casa en 2026?",
    excerpt: "Elegir entre un sistema Split o Multisplit puede marcar la diferencia en confort y presupuesto. Te explicamos cuál se adapta mejor a tu vivienda según tus necesidades reales.",
    coverImage: null,
    coverGradient: "linear-gradient(135deg, #0d3c4d 0%, #1d7291 55%, #008f65 100%)",
    date: "2026-04-14",
    category: "Guías",
    readTime: 5,
    content: `
<p>Elegir entre un sistema <strong>Split o Multisplit</strong> al instalar aire acondicionado puede marcar la diferencia en confort, consumo y presupuesto de tu hogar. En este artículo te explicamos, de forma clara y basada en información actual, cuál sistema te conviene más según tus necesidades y características de tu vivienda en 2026.</p>

<h2>¿Qué es un aire acondicionado Split?</h2>
<p>Un <strong>aire acondicionado Split</strong> está compuesto por <strong>una unidad interior y una unidad exterior</strong> conectadas entre sí. La unidad interna se encarga de enfriar o calentar el aire en una sola estancia, mientras que la unidad exterior aloja el compresor.</p>

<h3>► Ventajas del Split</h3>
<ul>
  <li>Es <strong>más económico</strong> que un sistema multisplit al instalar una sola unidad.</li>
  <li>La instalación y mantenimiento suelen ser <strong>más sencillos</strong>.</li>
  <li>Ideal para <strong>una habitación o espacio individual</strong>.</li>
</ul>
<p>Debido a esa simplicidad, los split individuales son una opción habitual cuando solo quieres climatizar 1 o 2 estancias sin complicaciones de diseño.</p>

<h2>¿Qué es un aire acondicionado Multisplit?</h2>
<p>Un <strong>sistema Multisplit</strong> permite conectar <strong>varias unidades interiores a una única unidad exterior</strong>. Esto facilita climatizar <strong>dos o más estancias</strong> sin tener un equipo exterior por cada una.</p>

<h3>► Ventajas del Multisplit</h3>
<ul>
  <li><strong>Ahorra espacio exterior</strong>, ya que solo hay una unidad exterior para varias habitaciones.</li>
  <li>Permite <strong>control independiente de temperatura</strong> en cada estancia, lo que ayuda a ahorrar energía.</li>
  <li>Puede ser más <strong>eficiente energéticamente</strong> que tener varios splits individuales.</li>
</ul>
<p>Un sistema multisplit es ideal en viviendas medianas o grandes que necesitan climatizar varias habitaciones con un solo compresor.</p>

<h2>Comparativa clave: Split vs Multisplit</h2>
<table>
  <thead>
    <tr>
      <th>Característica</th>
      <th>Split</th>
      <th>Multisplit</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>N° de estancias</td><td>1</td><td>Varias</td></tr>
    <tr><td>Unidad exterior</td><td>1 por unidad</td><td>1 para todas</td></tr>
    <tr><td>Coste inicial</td><td>Más bajo</td><td>Más alto</td></tr>
    <tr><td>Eficiencia energética</td><td>Variable</td><td>Puede ser mayor</td></tr>
    <tr><td>Control por habitación</td><td>Sí (cada unidad por separado)</td><td>Sí (independiente por interiores)</td></tr>
    <tr><td>Instalación</td><td>Simple</td><td>Más compleja</td></tr>
  </tbody>
</table>

<h2>¿Cuál consume menos energía?</h2>
<ul>
  <li>Si solo vas a climatizar <strong>una habitación</strong>, un Split suele ser suficiente y eficiente.</li>
  <li>Si quieres climatizar varias habitaciones con un solo sistema, un Multisplit puede tener un <strong>consumo menor total</strong> que varios splits individuales, porque la unidad exterior sola suele trabajar mejor y varios equipos combinados pueden optimizar el uso de energía.</li>
</ul>
<p>Por ejemplo, en sistemas multisplit modernos se puede regular individualmente cada unidad interior según uso real, lo que ayuda a reducir el consumo general en comparación con varios equipos independientes.</p>

<h2>Instalación y costes: ¿qué debes saber?</h2>

<h3>► Split</h3>
<ul>
  <li>Requiere una sola unidad exterior y una interior.</li>
  <li>Instalación más económica y rápida.</li>
</ul>

<h3>► Multisplit</h3>
<ul>
  <li>Una unidad exterior conecta varias unidades interiores, lo que <strong>requiere planificación y trayectoria de tuberías más compleja</strong>.</li>
  <li>Coste inicial mayor que un split individual, aunque puede ser <strong>más rentable a largo plazo</strong> si climatizas varias estancias con una sola instalación.</li>
</ul>

<h2>¿Cuál sistema elegir según tu vivienda?</h2>
<h3>Si solo necesitas climatizar una estancia</h3>
<p>✓ Elige un <strong>Split individual</strong> — económico y eficaz para una habitación o sala pequeña.</p>

<h3>Si tienes varias habitaciones o quieres un sistema integral</h3>
<p>✓ Elige un <strong>Multisplit</strong> — climatiza varias estancias con una sola unidad exterior y buen control de temperatura.</p>

<div class="nota-final">
  <p>La elección entre split o multisplit no es &ldquo;mejor o peor&rdquo;, sino que se adapta mejor a tu caso concreto: número de habitaciones, espacio exterior disponible, presupuesto inicial y eficiencia energética deseada.</p>
</div>

<h2>Conclusión</h2>
<p>Tanto los sistemas <strong>Split</strong> como los <strong>Multisplit</strong> tienen su lugar en 2026. Un Split es ideal para espacios individuales y con menor coste inicial, mientras que un Multisplit es perfecto si necesitas climatizar varias estancias y buscas eficiencia energética y estética exterior.</p>
    `.trim(),
    showComparisonTable: false,
    comparisonTable: null,
    tipText: null,
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(p => p.slug === slug);
}

export function getAllPosts(): BlogPost[] {
  return [...blogPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function fromDatabase(post: {
  slug: string; title: string; excerpt: string; coverImage: string | null;
  coverGradient: string; date: Date; category: string; readTime: number; content: string;
  showComparisonTable: boolean; tipText: string | null;
  comparisonTable: string | null;
}): BlogPost {
  return {
    ...post,
    date: post.date.toISOString().slice(0, 10),
    comparisonTable: parseComparisonTable(post.comparisonTable),
  };
}

function parseComparisonTable(value: string | null): ComparisonTableData | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as ComparisonTableData;
    if (!parsed.title || !Array.isArray(parsed.headers) || !Array.isArray(parsed.rows)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  if (!process.env.DATABASE_URL) return getAllPosts();
  let posts;
  try {
    posts = await db.blogPost.findMany({
      orderBy: { date: "desc" },
    });
  } catch (error) {
    if (isMissingBlogTableError(error)) return getAllPosts();
    throw error;
  }
  const databasePosts = posts.filter(post => post.isPublished).map(fromDatabase);
  const databaseSlugs = new Set(posts.map(post => post.slug));
  return [...databasePosts, ...getAllPosts().filter(post => !databaseSlugs.has(post.slug))]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPublishedPostBySlug(slug: string): Promise<BlogPost | undefined> {
  if (!process.env.DATABASE_URL) return getPostBySlug(slug);
  try {
    const post = await db.blogPost.findFirst({ where: { slug } });
    return post?.isPublished ? fromDatabase(post) : post ? undefined : getPostBySlug(slug);
  } catch (error) {
    if (isMissingBlogTableError(error)) return getPostBySlug(slug);
    throw error;
  }
}

function isMissingBlogTableError(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2021";
}
