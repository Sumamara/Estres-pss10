-- ═══════════════════════════════════════════════════════════════════════════
--  ENCUESTA PSS-10 · ESQUEMA DE SUPABASE
--
--  Cómo usarlo:
--    Supabase → SQL Editor → New query → pegar TODO esto → Run
--
--  Es idempotente: se puede volver a ejecutar sin romper nada.
-- ═══════════════════════════════════════════════════════════════════════════


-- ───────────────────────────────────────────────────────────────────────────
--  Tabla de respuestas
-- ───────────────────────────────────────────────────────────────────────────
create table if not exists public.pss10_respuestas (
    id                uuid        primary key default gen_random_uuid(),

    -- Quién y cuándo
    nombre            text,
    creado_en         timestamptz not null default now(),

    -- Respuesta a cada una de las 10 preguntas.
    -- Escala PSS-10: 0 = Nunca … 4 = Muy a menudo
    p1                smallint    not null check (p1  between 0 and 4),
    p2                smallint    not null check (p2  between 0 and 4),
    p3                smallint    not null check (p3  between 0 and 4),
    p4                smallint    not null check (p4  between 0 and 4),
    p5                smallint    not null check (p5  between 0 and 4),
    p6                smallint    not null check (p6  between 0 and 4),
    p7                smallint    not null check (p7  between 0 and 4),
    p8                smallint    not null check (p8  between 0 and 4),
    p9                smallint    not null check (p9  between 0 and 4),
    p10               smallint    not null check (p10 between 0 and 4),

    -- Resultado calculado (las preguntas 4, 5, 7 y 8 puntúan invertidas)
    puntuacion_total  smallint    not null check (puntuacion_total between 0 and 40),
    banda_key         text        not null,  -- con-margen | en-tension | al-limite
    banda_nombre      text        not null,  -- Con margen | En tensión | Al límite
    tiempo_segundos   integer     -- Tiempo en segundos que tardó en contestar
);

comment on table public.pss10_respuestas is
    'Respuestas del cuestionario PSS-10 (Escala de Estrés Percibido)';

-- Para listar las más recientes primero sin escanear toda la tabla
create index if not exists pss10_respuestas_creado_en_idx
    on public.pss10_respuestas (creado_en desc);


-- ───────────────────────────────────────────────────────────────────────────
--  Row Level Security
--
--  La web usa la clave "anon", que es PÚBLICA (viaja dentro del JavaScript
--  del navegador). Por eso solo se le permite INSERTAR.
--
--  Al no existir política de SELECT, nadie con esa clave puede leer las
--  respuestas: solo se ven desde el dashboard de Supabase o con la
--  service_role key (que NUNCA debe ir en el frontend).
-- ───────────────────────────────────────────────────────────────────────────
alter table public.pss10_respuestas enable row level security;

drop policy if exists "Insertar respuestas desde la web" on public.pss10_respuestas;

create policy "Insertar respuestas desde la web"
    on public.pss10_respuestas
    for insert
    to anon
    with check (true);


-- ═══════════════════════════════════════════════════════════════════════════
--  CONSULTAS ÚTILES (opcional — para el SQL Editor, no hace falta ejecutarlas)
-- ═══════════════════════════════════════════════════════════════════════════

-- Últimas respuestas
--   select nombre, puntuacion_total, banda_nombre, creado_en
--   from public.pss10_respuestas
--   order by creado_en desc
--   limit 50;

-- Cuánta gente cae en cada banda
--   select banda_nombre, count(*) as total, round(avg(puntuacion_total), 1) as media
--   from public.pss10_respuestas
--   group by banda_nombre
--   order by media;

-- Media por pregunta, para ver cuáles disparan más estrés
--   select round(avg(p1),2) as p1, round(avg(p2),2) as p2, round(avg(p3),2) as p3,
--          round(avg(p4),2) as p4, round(avg(p5),2) as p5, round(avg(p6),2) as p6,
--          round(avg(p7),2) as p7, round(avg(p8),2) as p8, round(avg(p9),2) as p9,
--          round(avg(p10),2) as p10
--   from public.pss10_respuestas;


-- ═══════════════════════════════════════════════════════════════════════════
--  NOTA: la versión anterior de este archivo creaba la tabla `pss10_leads`
--  (email + score + band), pensada para la captura de correo que ya no existe.
--  Si llegaste a crearla y no la necesitas:
--      drop table if exists public.pss10_leads;
-- ═══════════════════════════════════════════════════════════════════════════
