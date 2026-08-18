REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM public, authenticated, anon;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM public, authenticated, anon;
REVOKE EXECUTE ON FUNCTION public.is_parent_of(uuid, uuid) FROM public, authenticated, anon;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM public, authenticated, anon;
REVOKE EXECUTE ON FUNCTION public.teaches_class(uuid, uuid) FROM public, authenticated, anon;
REVOKE EXECUTE ON FUNCTION public.teaches_student(uuid, uuid) FROM public, authenticated, anon;
