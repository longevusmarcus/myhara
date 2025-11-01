-- Add nickname column to profiles table
ALTER TABLE public.profiles ADD COLUMN nickname text;

-- Update the handle_new_user function to use nickname
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public'
AS $$
begin
  insert into public.profiles (id, first_name, last_name, nickname)
  values (
    new.id, 
    new.raw_user_meta_data ->> 'first_name', 
    new.raw_user_meta_data ->> 'last_name',
    new.raw_user_meta_data ->> 'nickname'
  );
  return new;
end;
$$;