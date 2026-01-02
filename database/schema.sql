-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create chats table
create table public.chats (
  id uuid primary key not null,
  user_id uuid not null, -- Anonymous User UUID
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create messages table
create table public.messages (
  id uuid primary key default uuid_generate_v4(),
  chat_id uuid references public.chats(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indices for performance
create index idx_chats_user_id on public.chats(user_id);
create index idx_messages_chat_id on public.messages(chat_id);
