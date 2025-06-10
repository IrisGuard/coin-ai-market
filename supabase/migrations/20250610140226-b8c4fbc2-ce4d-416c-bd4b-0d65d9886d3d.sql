
-- Phase 3: AI Brain Enhancement Database Tables

-- 1. Enhanced AI Commands with new categories and features
ALTER TABLE public.ai_commands ADD COLUMN IF NOT EXISTS command_type text DEFAULT 'manual';
ALTER TABLE public.ai_commands ADD COLUMN IF NOT EXISTS priority integer DEFAULT 1;
ALTER TABLE public.ai_commands ADD COLUMN IF NOT EXISTS execution_timeout integer DEFAULT 30000;
ALTER TABLE public.ai_commands ADD COLUMN IF NOT EXISTS required_permissions text[] DEFAULT '{}';
ALTER TABLE public.ai_commands ADD COLUMN IF NOT EXISTS input_schema jsonb DEFAULT '{}';
ALTER TABLE public.ai_commands ADD COLUMN IF NOT EXISTS output_schema jsonb DEFAULT '{}';

-- 2. Automation Rules Engine
CREATE TABLE IF NOT EXISTS public.automation_rules (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  rule_type text NOT NULL DEFAULT 'scheduled', -- scheduled, event_triggered, condition_based
  trigger_config jsonb NOT NULL DEFAULT '{}',
  conditions jsonb DEFAULT '[]',
  actions jsonb NOT NULL DEFAULT '[]',
  is_active boolean DEFAULT true,
  last_executed timestamp with time zone,
  execution_count integer DEFAULT 0,
  success_count integer DEFAULT 0,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 3. Prediction Models for Analytics
CREATE TABLE IF NOT EXISTS public.prediction_models (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  model_type text NOT NULL, -- trend_analysis, market_prediction, user_behavior
  target_metric text NOT NULL,
  training_data_config jsonb DEFAULT '{}',
  model_parameters jsonb DEFAULT '{}',
  accuracy_score numeric DEFAULT 0.0,
  last_trained timestamp with time zone,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 4. AI Predictions Storage
CREATE TABLE IF NOT EXISTS public.ai_predictions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  model_id uuid REFERENCES public.prediction_models(id),
  prediction_type text NOT NULL,
  input_data jsonb NOT NULL,
  predicted_value jsonb NOT NULL,
  confidence_score numeric DEFAULT 0.5,
  prediction_date timestamp with time zone DEFAULT now(),
  actual_value jsonb,
  accuracy_check timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- 5. Command Queue System
CREATE TABLE IF NOT EXISTS public.command_queue (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  command_id uuid REFERENCES public.ai_commands(id),
  priority integer DEFAULT 1,
  scheduled_at timestamp with time zone DEFAULT now(),
  status text DEFAULT 'pending', -- pending, running, completed, failed, cancelled
  input_data jsonb DEFAULT '{}',
  execution_started timestamp with time zone,
  execution_completed timestamp with time zone,
  result_data jsonb,
  error_message text,
  retry_count integer DEFAULT 0,
  max_retries integer DEFAULT 3,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now()
);

-- 6. AI Performance Metrics
CREATE TABLE IF NOT EXISTS public.ai_performance_metrics (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_type text NOT NULL, -- command_execution, prediction_accuracy, automation_success
  metric_name text NOT NULL,
  metric_value numeric NOT NULL,
  metadata jsonb DEFAULT '{}',
  recorded_at timestamp with time zone DEFAULT now(),
  related_id uuid -- can reference commands, models, or rules
);

-- Enable RLS on new tables
ALTER TABLE public.automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prediction_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.command_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_performance_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin access
CREATE POLICY "Admin access to automation_rules" ON public.automation_rules
  FOR ALL USING (public.verify_admin_access_secure(auth.uid()));

CREATE POLICY "Admin access to prediction_models" ON public.prediction_models
  FOR ALL USING (public.verify_admin_access_secure(auth.uid()));

CREATE POLICY "Admin access to ai_predictions" ON public.ai_predictions
  FOR ALL USING (public.verify_admin_access_secure(auth.uid()));

CREATE POLICY "Admin access to command_queue" ON public.command_queue
  FOR ALL USING (public.verify_admin_access_secure(auth.uid()));

CREATE POLICY "Admin access to ai_performance_metrics" ON public.ai_performance_metrics
  FOR ALL USING (public.verify_admin_access_secure(auth.uid()));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_automation_rules_type ON public.automation_rules(rule_type);
CREATE INDEX IF NOT EXISTS idx_automation_rules_active ON public.automation_rules(is_active);
CREATE INDEX IF NOT EXISTS idx_prediction_models_type ON public.prediction_models(model_type);
CREATE INDEX IF NOT EXISTS idx_ai_predictions_model_id ON public.ai_predictions(model_id);
CREATE INDEX IF NOT EXISTS idx_command_queue_status ON public.command_queue(status);
CREATE INDEX IF NOT EXISTS idx_command_queue_priority ON public.command_queue(priority DESC);
CREATE INDEX IF NOT EXISTS idx_ai_performance_metrics_type ON public.ai_performance_metrics(metric_type);

-- Insert sample automation rules
INSERT INTO public.automation_rules (name, description, rule_type, trigger_config, actions) VALUES
('Daily System Health Check', 'Automatically check system health every day at 6 AM', 'scheduled', 
 '{"schedule": "0 6 * * *", "timezone": "UTC"}',
 '[{"type": "run_command", "command_name": "system_health_check"}, {"type": "send_notification", "recipients": ["admin"], "message": "Daily health check completed"}]'),
('High Error Rate Alert', 'Alert when error rate exceeds 5% in last hour', 'condition_based',
 '{"conditions": [{"metric": "error_rate_1h", "operator": ">", "value": 0.05}], "check_interval": 300}',
 '[{"type": "send_alert", "severity": "high", "message": "Error rate exceeded threshold"}]'),
('Auto Cleanup Old Logs', 'Clean up logs older than 30 days every week', 'scheduled',
 '{"schedule": "0 2 * * 0", "timezone": "UTC"}',
 '[{"type": "run_command", "command_name": "cleanup_old_logs"}, {"type": "log_activity", "message": "Weekly log cleanup completed"}]');

-- Insert sample prediction models
INSERT INTO public.prediction_models (name, model_type, target_metric, model_parameters) VALUES
('User Growth Prediction', 'trend_analysis', 'user_registrations', 
 '{"algorithm": "linear_regression", "lookback_days": 30, "forecast_days": 7}'),
('Coin Price Trend', 'market_prediction', 'average_coin_price',
 '{"algorithm": "time_series", "features": ["volume", "rarity", "grade"], "horizon": "7d"}'),
('Transaction Volume Forecast', 'trend_analysis', 'daily_transactions',
 '{"algorithm": "arima", "seasonality": true, "confidence_interval": 0.95}');

-- Create enhanced functions for AI Brain operations
CREATE OR REPLACE FUNCTION public.execute_automation_rule(rule_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  rule_record record;
  execution_result jsonb := '{"status": "success", "actions_executed": 0}';
  action_count integer := 0;
BEGIN
  -- Get the automation rule
  SELECT * INTO rule_record FROM public.automation_rules WHERE id = rule_id AND is_active = true;
  
  IF NOT FOUND THEN
    RETURN '{"status": "error", "message": "Rule not found or inactive"}';
  END IF;
  
  -- Update execution count and timestamp
  UPDATE public.automation_rules 
  SET execution_count = execution_count + 1,
      last_executed = now()
  WHERE id = rule_id;
  
  -- Log the execution
  INSERT INTO public.ai_performance_metrics (metric_type, metric_name, metric_value, metadata)
  VALUES ('automation_execution', rule_record.name, 1, 
          jsonb_build_object('rule_id', rule_id, 'rule_type', rule_record.rule_type));
  
  -- Simulate action execution (in real implementation, this would process the actions array)
  action_count := jsonb_array_length(rule_record.actions);
  
  execution_result := jsonb_set(execution_result, '{actions_executed}', to_jsonb(action_count));
  execution_result := jsonb_set(execution_result, '{rule_name}', to_jsonb(rule_record.name));
  execution_result := jsonb_set(execution_result, '{executed_at}', to_jsonb(now()));
  
  RETURN execution_result;
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_ai_prediction(model_id uuid, input_data jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  model_record record;
  prediction_value jsonb;
  confidence numeric;
  prediction_id uuid;
BEGIN
  -- Get the prediction model
  SELECT * INTO model_record FROM public.prediction_models WHERE id = model_id AND is_active = true;
  
  IF NOT FOUND THEN
    RETURN '{"status": "error", "message": "Model not found or inactive"}';
  END IF;
  
  -- Generate mock prediction (in real implementation, this would use actual ML)
  CASE model_record.model_type
    WHEN 'trend_analysis' THEN
      prediction_value := jsonb_build_object('trend', 'increasing', 'percentage', 15.5);
      confidence := 0.85;
    WHEN 'market_prediction' THEN
      prediction_value := jsonb_build_object('predicted_price', 1250.75, 'range_low', 1100, 'range_high', 1400);
      confidence := 0.78;
    ELSE
      prediction_value := jsonb_build_object('value', 'unknown');
      confidence := 0.5;
  END CASE;
  
  -- Store the prediction
  INSERT INTO public.ai_predictions (model_id, prediction_type, input_data, predicted_value, confidence_score)
  VALUES (model_id, model_record.model_type, input_data, prediction_value, confidence)
  RETURNING id INTO prediction_id;
  
  -- Log performance metric
  INSERT INTO public.ai_performance_metrics (metric_type, metric_name, metric_value, metadata, related_id)
  VALUES ('prediction_generation', model_record.name, confidence, 
          jsonb_build_object('model_type', model_record.model_type), prediction_id);
  
  RETURN jsonb_build_object(
    'status', 'success',
    'prediction_id', prediction_id,
    'predicted_value', prediction_value,
    'confidence_score', confidence,
    'model_name', model_record.name
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_ai_brain_dashboard_stats()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  result jsonb;
BEGIN
  WITH ai_stats AS (
    SELECT 
      (SELECT COUNT(*) FROM public.ai_commands WHERE is_active = true) as active_commands,
      (SELECT COUNT(*) FROM public.automation_rules WHERE is_active = true) as active_rules,
      (SELECT COUNT(*) FROM public.prediction_models WHERE is_active = true) as active_models,
      (SELECT COUNT(*) FROM public.command_queue WHERE status = 'pending') as pending_commands,
      (SELECT COUNT(*) FROM public.ai_command_executions WHERE created_at > now() - interval '24 hours') as executions_24h,
      (SELECT AVG(confidence_score) FROM public.ai_predictions WHERE created_at > now() - interval '7 days') as avg_confidence,
      (SELECT COUNT(*) FROM public.automation_rules WHERE last_executed > now() - interval '24 hours') as rules_executed_24h
  )
  SELECT jsonb_build_object(
    'active_commands', active_commands,
    'active_automation_rules', active_rules,
    'active_prediction_models', active_models,
    'pending_commands', pending_commands,
    'executions_24h', executions_24h,
    'average_prediction_confidence', COALESCE(avg_confidence, 0),
    'automation_rules_executed_24h', rules_executed_24h,
    'last_updated', now()
  ) INTO result
  FROM ai_stats;
  
  RETURN result;
END;
$function$;
