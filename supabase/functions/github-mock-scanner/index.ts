
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ProductionViolation {
  filePath: string;
  lineNumber: number;
  violationType: string;
  violationContent: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  context: string;
}

interface ScanResult {
  violations: ProductionViolation[];
  totalFiles: number;
  violationFiles: number;
  scanDuration: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { action, repoOwner, repoName, githubToken, violationId } = await req.json()

    if (action === 'scan_github_repo') {
      return await scanGithubRepository(supabaseClient, repoOwner, repoName, githubToken)
    }

    if (action === 'get_violations') {
      return await getStoredViolations(supabaseClient)
    }

    if (action === 'resolve_violation') {
      return await resolveViolation(supabaseClient, violationId)
    }

    throw new Error('Unknown action')

  } catch (error) {
    console.error('GitHub scanner error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function scanGithubRepository(
  supabase: any, 
  repoOwner: string, 
  repoName: string, 
  githubToken: string
): Promise<Response> {
  const scanStartTime = Date.now()
  const violations: ProductionViolation[] = []
  
  console.log(`🔍 Starting comprehensive GitHub scan for ${repoOwner}/${repoName}`)

  // Production-ready patterns for detecting ALL types of violations
  const productionPatterns = [
    // Critical violations
    { pattern: /Math\.random\(\)/g, type: 'math_random', severity: 'critical' as const },
    { pattern: /Math\.floor\(Math\.random\(\)/g, type: 'math_random_floor', severity: 'critical' as const },
    
    // High severity violations
    { pattern: /"mock"/gi, type: 'mock_string', severity: 'high' as const },
    { pattern: /"demo"/gi, type: 'demo_string', severity: 'high' as const },
    { pattern: /"fake"/gi, type: 'fake_string', severity: 'high' as const },
    { pattern: /"dummy"/gi, type: 'dummy_string', severity: 'high' as const },
    { pattern: /mockData/gi, type: 'mock_variable', severity: 'high' as const },
    { pattern: /demoData/gi, type: 'demo_variable', severity: 'high' as const },
    { pattern: /fakeData/gi, type: 'fake_variable', severity: 'high' as const },
    
    // Medium severity violations
    { pattern: /"test"/gi, type: 'test_string', severity: 'medium' as const },
    { pattern: /"placeholder"/gi, type: 'placeholder_string', severity: 'medium' as const },
    { pattern: /"sample"/gi, type: 'sample_string', severity: 'medium' as const },
    { pattern: /"example"/gi, type: 'example_string', severity: 'medium' as const },
    { pattern: /testData/gi, type: 'test_variable', severity: 'medium' as const },
    { pattern: /sampleData/gi, type: 'sample_variable', severity: 'medium' as const },
    { pattern: /placeholderData/gi, type: 'placeholder_variable', severity: 'medium' as const },
    { pattern: /lorem\s+ipsum/gi, type: 'lorem_ipsum', severity: 'medium' as const },
    { pattern: /"Lorem"/gi, type: 'lorem_string', severity: 'medium' as const },
    { pattern: /"user@example\.com"/gi, type: 'test_email', severity: 'medium' as const },
    { pattern: /"john\.doe"/gi, type: 'test_name', severity: 'medium' as const },
    { pattern: /"123-456-7890"/gi, type: 'test_phone', severity: 'medium' as const },
    
    // Constants and variables
    { pattern: /const\s+\w*[Mm]ock\w*/g, type: 'mock_const', severity: 'high' as const },
    { pattern: /const\s+\w*[Dd]emo\w*/g, type: 'demo_const', severity: 'high' as const },
    { pattern: /const\s+\w*[Tt]est\w*/g, type: 'test_const', severity: 'medium' as const },
    { pattern: /const\s+\w*[Ss]ample\w*/g, type: 'sample_const', severity: 'medium' as const },
    
    // Low severity violations
    { pattern: /console\.log\([^)]*mock[^)]*\)/gi, type: 'console_mock', severity: 'low' as const },
    { pattern: /console\.log\([^)]*test[^)]*\)/gi, type: 'console_test', severity: 'low' as const },
    { pattern: /\/\/.*TODO.*mock/gi, type: 'todo_mock', severity: 'low' as const },
    { pattern: /\/\/.*TODO.*test/gi, type: 'todo_test', severity: 'low' as const },
  ]

  try {
    // Get repository tree from GitHub API
    const treeUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/git/trees/main?recursive=1`
    const treeResponse = await fetch(treeUrl, {
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    })

    if (!treeResponse.ok) {
      throw new Error(`GitHub API error: ${treeResponse.status}`)
    }

    const treeData = await treeResponse.json()
    const files = treeData.tree.filter((item: any) => 
      item.type === 'blob' && 
      (item.path.endsWith('.ts') || 
       item.path.endsWith('.tsx') || 
       item.path.endsWith('.js') || 
       item.path.endsWith('.jsx'))
    )

    console.log(`📁 Found ${files.length} code files to scan`)

    // Scan each file
    for (const file of files) {
      try {
        // Get file content from GitHub
        const contentUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${file.path}`
        const contentResponse = await fetch(contentUrl, {
          headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        })

        if (contentResponse.ok) {
          const contentData = await contentResponse.json()
          const content = atob(contentData.content)
          const lines = content.split('\n')

          // Check each line against all patterns
          lines.forEach((line, lineIndex) => {
            productionPatterns.forEach(({ pattern, type, severity }) => {
              const matches = line.match(pattern)
              if (matches) {
                matches.forEach(match => {
                  violations.push({
                    filePath: file.path,
                    lineNumber: lineIndex + 1,
                    violationType: type,
                    violationContent: match,
                    severity,
                    context: line.trim()
                  })
                })
              }
            })
          })
        }
      } catch (fileError) {
        console.error(`Error scanning file ${file.path}:`, fileError)
      }
    }

    const scanDuration = Date.now() - scanStartTime
    const violationFiles = new Set(violations.map(v => v.filePath)).size

    // Clear previous violations and store new ones
    await supabase
      .from('mock_data_violations')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')

    // Store all violations in database
    if (violations.length > 0) {
      for (const violation of violations) {
        await supabase
          .from('mock_data_violations')
          .insert({
            file_path: violation.filePath,
            line_number: violation.lineNumber,
            violation_type: violation.violationType,
            violation_content: violation.violationContent,
            severity: violation.severity,
            status: 'active'
          })
      }
    }

    const result: ScanResult = {
      violations,
      totalFiles: files.length,
      violationFiles,
      scanDuration
    }

    console.log(`✅ GitHub scan completed: ${violations.length} violations found in ${violationFiles} files`)

    return new Response(
      JSON.stringify({ 
        success: true,
        result,
        message: `Found ${violations.length} violations in ${violationFiles} files`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('GitHub scan error:', error)
    throw error
  }
}

async function getStoredViolations(supabase: any): Promise<Response> {
  const { data: violations, error } = await supabase
    .from('mock_data_violations')
    .select('*')
    .eq('status', 'active')
    .order('severity', { ascending: false })

  if (error) throw error

  return new Response(
    JSON.stringify({ violations: violations || [] }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function resolveViolation(supabase: any, violationId: string): Promise<Response> {
  const { error } = await supabase
    .from('mock_data_violations')
    .update({
      status: 'resolved',
      resolved_at: new Date().toISOString()
    })
    .eq('id', violationId)

  if (error) throw error

  return new Response(
    JSON.stringify({ success: true, message: 'Violation resolved successfully' }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}
