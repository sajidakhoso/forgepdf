
CREATE TABLE public.tool_usage_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tool_name TEXT NOT NULL,
  tool_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.tool_usage_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tool usage"
ON public.tool_usage_history
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tool usage"
ON public.tool_usage_history
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_tool_usage_user_id ON public.tool_usage_history(user_id);
CREATE INDEX idx_tool_usage_created_at ON public.tool_usage_history(created_at DESC);
