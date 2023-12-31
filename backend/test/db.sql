--
-- PostgreSQL database dump
--

-- Dumped from database version 15.3
-- Dumped by pg_dump version 15.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: carts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carts (
    id integer NOT NULL,
    user_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer,
    calculated_price double precision,
    created_at timestamp without time zone NOT NULL,
    modified_at timestamp without time zone
);


ALTER TABLE public.carts OWNER TO postgres;

--
-- Name: carts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.carts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.carts_id_seq OWNER TO postgres;

--
-- Name: carts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.carts_id_seq OWNED BY public.carts.id;


--
-- Name: category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.category (
    id integer NOT NULL,
    category_name character varying(50) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    modified_at timestamp without time zone,
    image_id integer,
    is_archived boolean DEFAULT false NOT NULL
);


ALTER TABLE public.category OWNER TO postgres;

--
-- Name: category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.category_id_seq OWNER TO postgres;

--
-- Name: category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.category_id_seq OWNED BY public.category.id;


--
-- Name: federated_credentials; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.federated_credentials (
    user_id integer NOT NULL,
    provider character varying NOT NULL,
    subject character varying(200) NOT NULL
);


ALTER TABLE public.federated_credentials OWNER TO postgres;

--
-- Name: image_files; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.image_files (
    id integer NOT NULL,
    filename text NOT NULL,
    filepath text NOT NULL,
    mimetype text NOT NULL,
    size bigint NOT NULL
);


ALTER TABLE public.image_files OWNER TO postgres;

--
-- Name: image_files_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.image_files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.image_files_id_seq OWNER TO postgres;

--
-- Name: image_files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.image_files_id_seq OWNED BY public.image_files.id;


--
-- Name: order_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_details (
    id integer NOT NULL,
    user_id integer NOT NULL,
    total double precision,
    shipping_address character varying(255) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    modified_at timestamp without time zone,
    phone character varying NOT NULL
);


ALTER TABLE public.order_details OWNER TO postgres;

--
-- Name: order_details_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_details_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.order_details_id_seq OWNER TO postgres;

--
-- Name: order_details_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_details_id_seq OWNED BY public.order_details.id;


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    id integer NOT NULL,
    order_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer,
    price double precision,
    created_at timestamp without time zone NOT NULL,
    modified_at timestamp without time zone
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.order_items_id_seq OWNER TO postgres;

--
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    product_name character varying(50) NOT NULL,
    inventory_quantity integer NOT NULL,
    price double precision NOT NULL,
    discount_percentage integer,
    category_id integer,
    created_at timestamp without time zone NOT NULL,
    modified_at timestamp without time zone,
    is_archived boolean DEFAULT false NOT NULL,
    image_id integer
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.products_id_seq OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying,
    nickname character varying(255) NOT NULL,
    first_name character varying(50) NOT NULL,
    last_name character varying(50) NOT NULL,
    address character varying(255),
    phone character varying(50),
    created_at timestamp without time zone NOT NULL,
    modified_at timestamp without time zone,
    is_admin boolean
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: carts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts ALTER COLUMN id SET DEFAULT nextval('public.carts_id_seq'::regclass);


--
-- Name: category id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category ALTER COLUMN id SET DEFAULT nextval('public.category_id_seq'::regclass);


--
-- Name: image_files id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.image_files ALTER COLUMN id SET DEFAULT nextval('public.image_files_id_seq'::regclass);


--
-- Name: order_details id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_details ALTER COLUMN id SET DEFAULT nextval('public.order_details_id_seq'::regclass);


--
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.carts (id, user_id, product_id, quantity, calculated_price, created_at, modified_at) FROM stdin;
\.


--
-- Data for Name: category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.category (id, category_name, created_at, modified_at, image_id, is_archived) FROM stdin;
1	Shirts	2023-06-18 11:30:27.58	2023-07-23 16:10:57.029	\N	f
11	Pants	2023-07-23 13:25:02.491	2023-07-23 16:11:11.711	14	f
5	Skirts	2023-06-18 11:40:46.911	2023-07-25 13:10:04.849	21	f
\.


--
-- Data for Name: federated_credentials; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.federated_credentials (user_id, provider, subject) FROM stdin;
11	https://accounts.google.com	113265168225539854796
\.


--
-- Data for Name: image_files; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.image_files (id, filename, filepath, mimetype, size) FROM stdin;
14	1690107902468_PANTS_IMG.PNG	images\\1690107902468_PANTS_IMG.PNG	image/png	157536
21	1690117884374_skirts.PNG	images\\1690117884374_skirts.PNG	image/png	174700
28	1690281952596_retro_shirt.PNG	images\\1690281952596_retro_shirt.PNG	image/png	94803
\.


--
-- Data for Name: order_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_details (id, user_id, total, shipping_address, created_at, modified_at, phone) FROM stdin;
2	2	6.5	user2828	2023-06-18 15:00:42.779	\N	0
3	1	6.5	user2828	2023-07-25 15:54:07.036	\N	+972545686897
13	1	10	chu chu chu	2023-07-29 18:48:28.682	\N	05468294567
15	1	26.849999999999998	chu chu chu	2023-07-29 18:53:30.77	\N	05468294567
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_items (id, order_id, product_id, quantity, price, created_at, modified_at) FROM stdin;
1	2	7	3	1.5	2023-06-18 15:00:42.779	\N
2	2	1	4	5	2023-06-18 15:00:42.779	\N
3	3	7	3	1.5	2023-07-25 15:54:07.036	\N
4	3	1	4	5	2023-07-25 15:54:07.036	\N
11	13	2	1	5	2023-07-29 18:48:28.682	\N
12	13	3	1	5	2023-07-29 18:48:28.682	\N
16	15	9	1	21.849999999999998	2023-07-29 18:53:30.77	\N
17	15	3	1	5	2023-07-29 18:53:30.77	\N
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, product_name, inventory_quantity, price, discount_percentage, category_id, created_at, modified_at, is_archived, image_id) FROM stdin;
9	Retro shirt	3	23	5	1	2023-07-25 13:34:57.602	2023-07-29 18:53:30.77	f	28
3	short sleeve green	6	5	\N	1	2023-06-18 12:39:22.116	2023-07-29 18:53:30.77	f	\N
1	large pants black	3	7	\N	1	2023-06-18 12:38:44.354	2023-07-25 15:54:07.036	f	\N
7	short sleeve blue chcxcjss	6	5	10	1	2023-06-18 14:01:28.202	2023-07-27 11:10:11.322	f	\N
2	short sleeve red	5	5	\N	1	2023-06-18 12:39:18.463	2023-07-29 18:50:49.355	f	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, password, nickname, first_name, last_name, address, phone, created_at, modified_at, is_admin) FROM stdin;
2	user_gCheck	$2b$10$ORRYqbw9MGrGni/TGp857e4GagB3iTcExejl3UMucTpPpfdK5WN9G	usercg	user	check	checky check 23 new	+9723484849	2023-06-18 11:16:43.994	2023-06-18 11:23:30.467	\N
3	userCheck55	$2b$10$bWra5HDyyBB.NABwdx/1eu.NHIsLvkFyO6q80Evf9Y3DlJkHHyGU.	userc55	user	check	checky check 23	+9723484848	2023-06-19 13:56:16.013	\N	\N
5	userCheck545	$2b$10$gxN.a1VhmuXZX.ZV2gQcEO.1cvXMyMZpreQ9MghwuxDYWDsxhpzFi	userc545	user	check	checky check 23	+9723484848	2023-06-19 13:58:32.186	\N	\N
6	userCheck5445	$2b$10$sZIbLZEmM0w9n06p7skDGOsRc7RVEmDgcSGjdP86QA63mdhtWRsr2	userc5445	user	check	checky check 23	+9723484848	2023-06-19 13:58:56.146	\N	\N
7	userCk5445	$2b$10$UeeJP/QxWXlo37sfn.fyAOiaV2Ei6nxOuXDsg.WRn.shBdLBKdkjO	use5445	user	check	checky check 23	+9723484848	2023-06-19 13:59:36.044	\N	\N
8	user33Ck5445	$2b$10$Sc8wt6X3n.wqQ1yHVm2iYOztF.8mrLQQwxkKJmGTY0XY4h81Y0ksC	use45445	user	check	checky check 23	+9723484848	2023-06-19 14:00:24.819	\N	t
15	sfas@gmail.com	$2b$10$uLE4VyL4oG5PDagO1zVnzesMK7zaS3eeBc6Y5QdfUAqILn2NBr5Ei	gsdgsg	hjfgjf	jgfjgf	lohlhl	+972543397933	2023-07-18 14:44:53.999	\N	\N
1	userCheck	$2b$10$xGRbQBRNzcX20S.JhB5Z9u/nsXIbseeZ/YFUURfNIDSwU3ZCVuwwC	userc	user	check	Tel Aviv 4 Israel	0567898989	2023-06-18 11:15:48.901	2023-07-18 19:39:18.728	t
11	inbalgamliel90@gmail.com	\N	Inbal Gamliel	Inbal	Gamliel	Kirn 37 b	0545797922	2023-07-17 19:42:05.531	2023-07-20 11:23:10.157	t
\.


--
-- Name: carts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.carts_id_seq', 19, true);


--
-- Name: category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.category_id_seq', 15, true);


--
-- Name: image_files_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.image_files_id_seq', 28, true);


--
-- Name: order_details_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_details_id_seq', 15, true);


--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_items_id_seq', 17, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 9, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 15, true);


--
-- Name: carts carts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY (id);


--
-- Name: category category_category_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_category_name_key UNIQUE (category_name);


--
-- Name: category category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_pkey PRIMARY KEY (id);


--
-- Name: image_files image_files_filename_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.image_files
    ADD CONSTRAINT image_files_filename_key UNIQUE (filename);


--
-- Name: image_files image_files_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.image_files
    ADD CONSTRAINT image_files_pkey PRIMARY KEY (id);


--
-- Name: order_details order_details_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_details
    ADD CONSTRAINT order_details_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: products products_product_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_product_name_key UNIQUE (product_name);


--
-- Name: users users_nickname_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_nickname_key UNIQUE (nickname);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: carts carts_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: carts carts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: category fk_image_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT fk_image_id FOREIGN KEY (image_id) REFERENCES public.image_files(id) ON DELETE CASCADE;


--
-- Name: order_details order_details_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_details
    ADD CONSTRAINT order_details_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.order_details(id);


--
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.category(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

