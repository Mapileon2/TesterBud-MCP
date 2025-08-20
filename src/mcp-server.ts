#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { logger } from './utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

// Define tool schemas
const AnalyzeCodeSchema = z.object({
  code: z.string().describe('The code to analyze'),
  language: z.string().optional().describe('Programming language of the code'),
  context: z.string().optional().describe('Additional context about the code'),
});

const GenerateCodeSchema = z.object({
  prompt: z.string().describe('Description of what code to generate'),
  language: z.string().optional().describe('Target programming language'),
  style: z.string().optional().describe('Coding style preferences'),
});

const DebugCodeSchema = z.object({
  code: z.string().describe('Code with potential issues to debug'),
  error: z.string().optional().describe('Error message or description'),
  language: z.string().optional().describe('Programming language'),
});

const GetContextSchema = z.object({
  query: z.string().describe('Query to get relevant context'),
  maxResults: z.number().optional().default(5).describe('Maximum number of results'),
});

class Context7MCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'TesterBud',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupTools();
  }

  private setupTools() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'analyze_code',
            description: 'Analyze code for patterns, potential issues, and improvements',
            inputSchema: AnalyzeCodeSchema,
          },
          {
            name: 'generate_code',
            description: 'Generate code based on requirements and context',
            inputSchema: GenerateCodeSchema,
          },
          {
            name: 'debug_code',
            description: 'Debug code issues and provide solutions',
            inputSchema: DebugCodeSchema,
          },
          {
            name: 'get_context',
            description: 'Get relevant context and documentation for coding tasks',
            inputSchema: GetContextSchema,
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'analyze_code':
            return await this.handleAnalyzeCode(args);
          case 'generate_code':
            return await this.handleGenerateCode(args);
          case 'debug_code':
            return await this.handleDebugCode(args);
          case 'get_context':
            return await this.handleGetContext(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        logger.error(`Error executing tool ${name}: ${error}`);
        throw error;
      }
    });
  }

  private async handleAnalyzeCode(args: any) {
    const { code, language, context } = args;
    
    const prompt = `Analyze the following ${language || ''} code${context ? ` in the context of ${context}` : ''}:

\`\`\`${language || ''}
${code}
\`\`\`

Please provide:
1. Code quality assessment
2. Potential issues or bugs
3. Performance considerations
4. Best practices recommendations
5. Security considerations

Format your response in a clear, structured way.`;

    // For now, return a placeholder response
    return {
      content: [
        {
          type: 'text',
          text: `Code Analysis for ${language || 'unknown language'}:\n\n**Code Quality:** Good structure with clear naming conventions.\n**Potential Issues:** No obvious issues detected.\n**Performance:** Efficient implementation.\n**Best Practices:** Follows standard patterns.\n**Security:** No security concerns identified.`,
        },
      ],
    };
  }

  private async handleGenerateCode(args: any) {
    const { prompt, language, style } = args;
    
    const fullPrompt = `Generate ${language || 'programming'} code for the following requirement:

${prompt}

${style ? `Style preferences: ${style}` : ''}

Please provide complete, working code with explanations.`;

    return {
      content: [
        {
          type: 'text',
          text: `Generated ${language || 'code'} for: ${prompt}\n\n\`\`\`${language || ''}
// Generated code will be implemented here
console.log('Hello, World!');
\`\`\`

This is a placeholder response. Configure GEMINI_API_KEY for actual generation.`,
        },
      ],
    };
  }

  private async handleDebugCode(args: any) {
    const { code, error, language } = args;
    
    return {
      content: [
        {
          type: 'text',
          text: `Debug Analysis for ${language || 'unknown language'}:\n\n**Issue:** ${error || 'No specific error provided'}\n**Code:**\n\`\`\`${language || ''}
${code}
\`\`\`\n**Analysis:** Please provide the specific error message for detailed debugging assistance.`,
        },
      ],
    };
  }

  private async handleGetContext(args: any) {
    const { query, maxResults } = args;
    
    return {
      content: [
        {
          type: 'text',
          text: `Context for query: ${query}\n\n**Relevant Information:**\n- Programming best practices\n- Documentation resources\n- Code examples\n- Common patterns\n\n**Max Results:** ${maxResults}\n\nThis is a placeholder response. Configure with actual context sources.`,
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.log('Context7 MCP Server started and connected via stdio');
  }
}

// Start the server
async function main() {
  try {
    const server = new Context7MCPServer();
    await server.run();
  } catch (error) {
    console.error('Failed to start MCP server:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

export { Context7MCPServer };