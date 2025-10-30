-- ProDeals Database Schema for Supabase

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Products table
create table products (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  price numeric not null,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Orders table
create table orders (
  id uuid default uuid_generate_v4() primary key,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  products jsonb not null,
  total numeric not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Admins table (using Supabase auth)
create table admins (
  id uuid references auth.users primary key,
  email text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table products enable row level security;
alter table orders enable row level security;
alter table admins enable row level security;

-- Policies for products (public read, admin write)
create policy "Products are viewable by everyone"
  on products for select
  using (true);

create policy "Admins can insert products"
  on products for insert
  with check (
    exists (
      select 1 from admins
      where admins.id = auth.uid()
    )
  );

create policy "Admins can update products"
  on products for update
  using (
    exists (
      select 1 from admins
      where admins.id = auth.uid()
    )
  );

create policy "Admins can delete products"
  on products for delete
  using (
    exists (
      select 1 from admins
      where admins.id = auth.uid()
    )
  );

-- Policies for orders (customers can create, admins can view and update)
create policy "Anyone can create orders"
  on orders for insert
  with check (true);

create policy "Admins can view all orders"
  on orders for select
  using (
    exists (
      select 1 from admins
      where admins.id = auth.uid()
    )
  );

create policy "Admins can update orders"
  on orders for update
  using (
    exists (
      select 1 from admins
      where admins.id = auth.uid()
    )
  );

-- Policies for admins
create policy "Admins can view other admins"
  on admins for select
  using (
    exists (
      select 1 from admins
      where admins.id = auth.uid()
    )
  );

create policy "Admins can insert other admins"
  on admins for insert
  with check (
    exists (
      select 1 from admins
      where admins.id = auth.uid()
    )
  );

-- Insert sample products
insert into products (title, description, price) values
  ('قالب موقع احترافي', 'قالب HTML/CSS بسيط وسهل التخصيص', 1200),
  ('دورة برمجة جافاسكربت', 'دورة مكثفة للمبتدئين', 2500),
  ('كتاب إلكتروني: تسويق رقمي', 'دليل عملي للتسويق عبر الإنترنت', 800),
  ('مؤثرات صوتية لمواقع', 'حزمة مؤثرات بجودة عالية', 400);
