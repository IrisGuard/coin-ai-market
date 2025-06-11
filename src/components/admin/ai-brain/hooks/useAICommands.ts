
import { useAICommandsQuery } from './useAICommandsQuery';
import { useAICommandsRealtime } from './useAICommandsRealtime';
import { useAICommandsMutations } from './useAICommandsMutations';
import { useAICommandExecution } from './useAICommandExecution';
import { useQueryClient } from '@tanstack/react-query';

export const useAICommands = () => {
  const queryClient = useQueryClient();
  
  // Use the query hook
  const { data: commands = [], isLoading, error, refetch } = useAICommandsQuery();
  
  // Set up real-time subscription
  useAICommandsRealtime();
  
  // Get mutation hooks
  const {
    createCommandMutation,
    updateCommandMutation,
    deleteCommandMutation
  } = useAICommandsMutations();
  
  // Get execution hook
  const { executeCommandMutation } = useAICommandExecution();

  return {
    commands,
    isLoading,
    error,
    refetch,
    createCommandMutation,
    updateCommandMutation,
    deleteCommandMutation,
    executeCommandMutation,
    queryClient
  };
};
