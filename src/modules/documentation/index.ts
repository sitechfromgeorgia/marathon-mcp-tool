/**
 * 📚 Documentation & Content Module
 * დოკუმენტაცია და კონტენტის მოდული
 * 
 * Documentation Access:
 * - marathon_fetch_docs - დოკუმენტაციის მიღება
 * - marathon_search_docs - დოკუმენტაციაში ძიება
 * 
 * Web Content:
 * - marathon_fetch_url_content - URL კონტენტის მიღება
 * - marathon_web_scraping - ვებ საიტების scraping
 * 
 * Content Generation:
 * - marathon_generate_markdown - Markdown-ის გენერაცია
 * - marathon_export_content - კონტენტის ექსპორტი
 */

import { promises as fs } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { MarathonConfig } from '../../config/marathon-config.js';
import { MarathonLogger } from '../../utils/logger.js';

interface DocumentationEntry {
  id: string;
  title: string;
  url: string;
  content: string;
  sections: string[];
  lastUpdated: string;
  tags: string[];
}

interface ScrapingResult {
  url: string;
  title: string;
  content: string;
  links: Array<{ text: string; href: string }>;
  images: Array<{ alt: string; src: string }>;
  metadata: Record<string, string>;
}

export class DocumentationModule {
  private config: MarathonConfig;
  private logger: MarathonLogger;
  private readonly moduleName = 'documentation';
  private docsPath: string;
  private cacheTimeout = 24 * 60 * 60 * 1000; // 24 hours

  constructor(config: MarathonConfig, logger: MarathonLogger) {
    this.config = config;
    this.logger = logger;
    this.docsPath = join(homedir(), '.marathon-mcp', 'docs');
    this.initializeStorage();
  }

  private async initializeStorage(): Promise<void> {
    try {
      await fs.mkdir(this.docsPath, { recursive: true });
    } catch (error) {
      console.warn('⚠️ დოკუმენტაციის ინიციალიზაციის შეცდომა:', error);
    }
  }

  public async getTools(): Promise<any[]> {
    const georgian = this.config.getGeorgianInterface();
    
    return [
      // Documentation Access
      {
        name: 'marathon_fetch_docs',
        description: `${georgian['marathon_fetch_docs']} - Fetch documentation from URLs`,
        inputSchema: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description: 'Documentation URL to fetch'
            },
            title: {
              type: 'string',
              description: 'Optional documentation title'
            },
            tags: {
              type: 'array',
              items: { type: 'string' },
              description: 'Tags for categorization'
            },
            force_refresh: {
              type: 'boolean',
              description: 'Force refresh cached content',
              default: false
            },
            extract_sections: {
              type: 'boolean',
              description: 'Extract section headings',
              default: true
            }
          },
          required: ['url']
        }
      },
      {
        name: 'marathon_search_docs',
        description: `${georgian['marathon_search_docs']} - Search within cached documentation`,
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query'
            },
            filters: {
              type: 'object',
              properties: {
                tags: { type: 'array', items: { type: 'string' } },
                url_pattern: { type: 'string' },
                title_pattern: { type: 'string' },
                max_results: { type: 'number', default: 10 }
              }
            },
            highlight: {
              type: 'boolean',
              description: 'Highlight search terms',
              default: true
            }
          },
          required: ['query']
        }
      },
      
      // Web Content
      {
        name: 'marathon_fetch_url_content',
        description: `${georgian['marathon_fetch_url_content']} - Fetch content from any URL`,
        inputSchema: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description: 'URL to fetch content from'
            },
            format: {
              type: 'string',
              enum: ['text', 'html', 'json', 'markdown'],
              default: 'text',
              description: 'Output format'
            },
            headers: {
              type: 'object',
              description: 'Custom HTTP headers'
            },
            timeout: {
              type: 'number',
              description: 'Request timeout in milliseconds',
              default: 10000
            }
          },
          required: ['url']
        }
      },
      {
        name: 'marathon_web_scraping',
        description: `${georgian['marathon_web_scraping']} - Advanced web scraping with selectors`,
        inputSchema: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description: 'URL to scrape'
            },
            selectors: {
              type: 'object',
              description: 'CSS selectors for specific content',
              properties: {
                title: { type: 'string' },
                content: { type: 'string' },
                links: { type: 'string' },
                images: { type: 'string' },
                tables: { type: 'string' }
              }
            },
            options: {
              type: 'object',
              properties: {
                follow_redirects: { type: 'boolean', default: true },
                extract_metadata: { type: 'boolean', default: true },
                clean_html: { type: 'boolean', default: true },
                max_depth: { type: 'number', default: 1 }
              }
            }
          },
          required: ['url']
        }
      },
      
      // Content Generation
      {
        name: 'marathon_generate_markdown',
        description: `${georgian['marathon_generate_markdown']} - Generate Markdown documentation`,
        inputSchema: {
          type: 'object',
          properties: {
            content: {
              type: 'object',
              description: 'Content structure',
              properties: {
                title: { type: 'string' },
                sections: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      heading: { type: 'string' },
                      content: { type: 'string' },
                      level: { type: 'number', default: 2 }
                    }
                  }
                },
                metadata: { type: 'object' }
              },
              required: ['title', 'sections']
            },
            template: {
              type: 'string',
              enum: ['basic', 'technical', 'api', 'tutorial', 'georgian'],
              default: 'basic'
            },
            output_file: {
              type: 'string',
              description: 'Optional output file path'
            }
          },
          required: ['content']
        }
      },
      {
        name: 'marathon_export_content',
        description: `${georgian['marathon_export_content']} - Export content in various formats`,
        inputSchema: {
          type: 'object',
          properties: {
            source: {
              type: 'string',
              description: 'Source content (URL, file path, or direct content)'
            },
            format: {
              type: 'string',
              enum: ['pdf', 'docx', 'html', 'txt', 'json'],
              description: 'Export format'
            },
            output_path: {
              type: 'string',
              description: 'Output file path'
            },
            options: {
              type: 'object',
              properties: {
                include_images: { type: 'boolean', default: true },
                styling: { type: 'string', enum: ['basic', 'professional', 'georgian'] },
                page_size: { type: 'string', enum: ['A4', 'Letter'], default: 'A4' }
              }
            }
          },
          required: ['source', 'format', 'output_path']
        }
      }
    ];
  }

  public async handleTool(name: string, args: any): Promise<any> {
    const startTime = Date.now();
    
    try {
      await this.logger.logFunctionCall(name, args, this.moduleName);
      
      if (!this.config.isModuleEnabled('documentation')) {
        throw new Error('დოკუმენტაცია და კონტენტის მოდული გამორთულია');
      }
      
      let result;
      
      switch (name) {
        case 'marathon_fetch_docs':
          result = await this.fetchDocs(args);
          break;
        case 'marathon_search_docs':
          result = await this.searchDocs(args);
          break;
        case 'marathon_fetch_url_content':
          result = await this.fetchUrlContent(args);
          break;
        case 'marathon_web_scraping':
          result = await this.webScraping(args);
          break;
        case 'marathon_generate_markdown':
          result = await this.generateMarkdown(args);
          break;
        case 'marathon_export_content':
          result = await this.exportContent(args);
          break;
        default:
          return null;
      }

      const duration = Date.now() - startTime;
      await this.logger.logFunctionResult(name, result, duration, this.moduleName);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2)
          }
        ]
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      await this.logger.logFunctionError(name, error, duration, this.moduleName);
      throw error;
    }
  }

  // Documentation Access
  private async fetchDocs(args: any): Promise<any> {
    const { url, title, tags = [], force_refresh = false, extract_sections = true } = args;
    
    try {
      const docId = this.generateDocId(url);
      const cacheFile = join(this.docsPath, `${docId}.json`);
      
      // Check cache unless force refresh
      if (!force_refresh) {
        try {
          const cached = await fs.readFile(cacheFile, 'utf-8');
          const cachedDoc: DocumentationEntry = JSON.parse(cached);
          
          const isExpired = Date.now() - new Date(cachedDoc.lastUpdated).getTime() > this.cacheTimeout;
          
          if (!isExpired) {
            return {
              status: 'success',
              message: `📚 დოკუმენტაცია ჩატვირთულია cache-დან: ${cachedDoc.title}`,
              document: cachedDoc,
              source: 'cache',
              timestamp: new Date().toISOString()
            };
          }
        } catch {
          // Cache miss, continue to fetch
        }
      }
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Marathon MCP Tool Documentation Fetcher'
        },
        timeout: 15000
      });
      
      if (!response.ok) {
        return {
          status: 'error',
          message: `❌ URL-ის მიღების შეცდომა: ${response.status} ${response.statusText}`,
          url,
          status_code: response.status
        };
      }
      
      const html = await response.text();
      const $ = cheerio.load(html);
      
      // Remove script and style tags
      $('script, style, nav, footer, aside').remove();
      
      // Extract title
      const docTitle = title || $('title').text().trim() || $('h1').first().text().trim() || 'Untitled Document';
      
      // Extract main content
      let content = '';
      const contentSelectors = ['main', 'article', '.content', '.documentation', 'body'];
      
      for (const selector of contentSelectors) {
        const element = $(selector);
        if (element.length > 0) {
          content = element.text().trim();
          break;
        }
      }
      
      if (!content) {
        content = $('body').text().trim();
      }
      
      // Extract sections if requested
      let sections: string[] = [];
      if (extract_sections) {
        $('h1, h2, h3, h4, h5, h6').each((_, element) => {
          const heading = $(element).text().trim();
          if (heading) {
            sections.push(heading);
          }
        });
      }
      
      const documentation: DocumentationEntry = {
        id: docId,
        title: docTitle,
        url,
        content: content.substring(0, 50000), // Limit content size
        sections,
        lastUpdated: new Date().toISOString(),
        tags
      };
      
      // Save to cache
      await fs.writeFile(cacheFile, JSON.stringify(documentation, null, 2), 'utf-8');
      
      return {
        status: 'success',
        message: `✅ დოკუმენტაცია წარმატებით ჩატვირთულია: ${docTitle}`,
        document: documentation,
        source: 'web',
        content_size: content.length,
        sections_count: sections.length,
        cached: true,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ დოკუმენტაციის ჩატვირთვის შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'}`,
        url
      };
    }
  }

  private async searchDocs(args: any): Promise<any> {
    const { query, filters = {}, highlight = true } = args;
    
    try {
      const files = await fs.readdir(this.docsPath);
      const results: Array<DocumentationEntry & { relevance: number; matches: string[] }> = [];
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          try {
            const content = await fs.readFile(join(this.docsPath, file), 'utf-8');
            const doc: DocumentationEntry = JSON.parse(content);
            
            // Apply filters
            if (filters.tags && !filters.tags.some((tag: string) => doc.tags.includes(tag))) {
              continue;
            }
            
            if (filters.url_pattern && !doc.url.includes(filters.url_pattern)) {
              continue;
            }
            
            if (filters.title_pattern && !doc.title.toLowerCase().includes(filters.title_pattern.toLowerCase())) {
              continue;
            }
            
            // Search in content
            const queryLower = query.toLowerCase();
            const contentLower = doc.content.toLowerCase();
            const titleLower = doc.title.toLowerCase();
            const sectionsLower = doc.sections.join(' ').toLowerCase();
            
            const titleMatches = titleLower.includes(queryLower);
            const contentMatches = contentLower.includes(queryLower);
            const sectionMatches = sectionsLower.includes(queryLower);
            
            if (titleMatches || contentMatches || sectionMatches) {
              let relevance = 0;
              const matches: string[] = [];
              
              if (titleMatches) {
                relevance += 10;
                matches.push('title');
              }
              
              if (sectionMatches) {
                relevance += 5;
                matches.push('sections');
              }
              
              if (contentMatches) {
                relevance += 1;
                matches.push('content');
                
                // Count occurrences for relevance
                const occurrences = (contentLower.match(new RegExp(queryLower, 'g')) || []).length;
                relevance += Math.min(occurrences, 10);
              }
              
              results.push({
                ...doc,
                relevance,
                matches
              });
            }
          } catch {
            continue;
          }
        }
      }
      
      // Sort by relevance
      results.sort((a, b) => b.relevance - a.relevance);
      
      // Limit results
      const limitedResults = results.slice(0, filters.max_results || 10);
      
      // Add highlights if requested
      const processedResults = limitedResults.map(result => {
        let processedContent = result.content;
        
        if (highlight) {
          const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
          processedContent = result.content.replace(regex, '**$1**');
        }
        
        return {
          id: result.id,
          title: result.title,
          url: result.url,
          relevance: result.relevance,
          matches: result.matches,
          content_preview: processedContent.substring(0, 300) + '...',
          sections: result.sections.slice(0, 5),
          tags: result.tags,
          last_updated: result.lastUpdated
        };
      });
      
      return {
        status: 'success',
        message: `🔍 ძიების შედეგები: ${processedResults.length} დოკუმენტი მოიძებნა`,
        query,
        results: processedResults,
        total_searched: files.filter(f => f.endsWith('.json')).length,
        total_found: results.length,
        filters_applied: filters,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ ძიების შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'}`,
        query
      };
    }
  }

  // Web Content
  private async fetchUrlContent(args: any): Promise<any> {
    const { url, format = 'text', headers = {}, timeout = 10000 } = args;
    
    try {
      const defaultHeaders = {
        'User-Agent': 'Marathon MCP Tool Content Fetcher',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        ...headers
      };
      
      const response = await fetch(url, {
        headers: defaultHeaders,
        timeout
      });
      
      if (!response.ok) {
        return {
          status: 'error',
          message: `❌ კონტენტის მიღების შეცდომა: ${response.status} ${response.statusText}`,
          url,
          status_code: response.status
        };
      }
      
      const rawContent = await response.text();
      let processedContent: any = rawContent;
      
      switch (format) {
        case 'text':
          const $ = cheerio.load(rawContent);
          $('script, style, nav, footer, aside').remove();
          processedContent = $('body').text().trim().replace(/\s+/g, ' ');
          break;
          
        case 'html':
          processedContent = rawContent;
          break;
          
        case 'json':
          try {
            processedContent = JSON.parse(rawContent);
          } catch {
            processedContent = { raw_content: rawContent };
          }
          break;
          
        case 'markdown':
          const $md = cheerio.load(rawContent);
          $md('script, style, nav, footer, aside').remove();
          
          // Convert basic HTML to Markdown
          processedContent = this.htmlToMarkdown($md('body').html() || '');
          break;
      }
      
      return {
        status: 'success',
        message: `✅ კონტენტი წარმატებით მიღებულია: ${url}`,
        url,
        format,
        content: processedContent,
        content_type: response.headers.get('content-type'),
        content_size: rawContent.length,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ კონტენტის მიღების შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'}`,
        url
      };
    }
  }

  private async webScraping(args: any): Promise<any> {
    const { url, selectors = {}, options = {} } = args;
    
    try {
      const {
        follow_redirects = true,
        extract_metadata = true,
        clean_html = true,
        max_depth = 1
      } = options;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Marathon MCP Tool Web Scraper'
        },
        redirect: follow_redirects ? 'follow' : 'manual'
      });
      
      if (!response.ok) {
        return {
          status: 'error',
          message: `❌ scraping-ის შეცდომა: ${response.status} ${response.statusText}`,
          url,
          status_code: response.status
        };
      }
      
      const html = await response.text();
      const $ = cheerio.load(html);
      
      if (clean_html) {
        $('script, style, nav, footer, aside').remove();
      }
      
      const result: ScrapingResult = {
        url,
        title: $(selectors.title || 'title, h1').first().text().trim() || 'No title found',
        content: $(selectors.content || 'main, article, .content, body').first().text().trim() || '',
        links: [],
        images: [],
        metadata: {}
      };
      
      // Extract links
      $(selectors.links || 'a[href]').each((_, element) => {
        const $el = $(element);
        const href = $el.attr('href');
        const text = $el.text().trim();
        
        if (href && text) {
          result.links.push({ text, href });
        }
      });
      
      // Extract images
      $(selectors.images || 'img[src]').each((_, element) => {
        const $el = $(element);
        const src = $el.attr('src');
        const alt = $el.attr('alt') || '';
        
        if (src) {
          result.images.push({ alt, src });
        }
      });
      
      // Extract metadata
      if (extract_metadata) {
        $('meta').each((_, element) => {
          const $el = $(element);
          const name = $el.attr('name') || $el.attr('property');
          const content = $el.attr('content');
          
          if (name && content) {
            result.metadata[name] = content;
          }
        });
      }
      
      return {
        status: 'success',
        message: `✅ ვებ scraping წარმატებით დასრულდა: ${url}`,
        result,
        links_found: result.links.length,
        images_found: result.images.length,
        metadata_fields: Object.keys(result.metadata).length,
        content_size: result.content.length,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ ვებ scraping-ის შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'}`,
        url
      };
    }
  }

  // Content Generation
  private async generateMarkdown(args: any): Promise<any> {
    const { content, template = 'basic', output_file } = args;
    
    try {
      let markdown = '';
      
      // Add title
      markdown += `# ${content.title}\n\n`;
      
      // Add metadata if present
      if (content.metadata) {
        markdown += '---\n';
        for (const [key, value] of Object.entries(content.metadata)) {
          markdown += `${key}: ${value}\n`;
        }
        markdown += '---\n\n';
      }
      
      // Add sections
      for (const section of content.sections) {
        const level = '#'.repeat(section.level || 2);
        markdown += `${level} ${section.heading}\n\n`;
        markdown += `${section.content}\n\n`;
      }
      
      // Apply template styling
      switch (template) {
        case 'georgian':
          markdown = this.applyGeorgianTemplate(markdown);
          break;
        case 'technical':
          markdown = this.applyTechnicalTemplate(markdown);
          break;
        case 'api':
          markdown = this.applyApiTemplate(markdown);
          break;
        case 'tutorial':
          markdown = this.applyTutorialTemplate(markdown);
          break;
      }
      
      // Save to file if specified
      if (output_file) {
        await fs.writeFile(output_file, markdown, 'utf-8');
      }
      
      return {
        status: 'success',
        message: `✅ Markdown დოკუმენტი წარმატებით შეიქმნა: ${content.title}`,
        title: content.title,
        template,
        markdown,
        output_file,
        size: markdown.length,
        sections_count: content.sections.length,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ Markdown-ის გენერაციის შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'}`,
        title: content.title
      };
    }
  }

  private async exportContent(args: any): Promise<any> {
    const { source, format, output_path, options = {} } = args;
    
    try {
      // This is a simplified implementation
      // In a real implementation, you would use libraries like puppeteer, docx, etc.
      
      let content = '';
      
      // Determine source type and get content
      if (source.startsWith('http')) {
        const response = await fetch(source);
        content = await response.text();
      } else {
        try {
          content = await fs.readFile(source, 'utf-8');
        } catch {
          content = source; // Treat as direct content
        }
      }
      
      // Convert based on format
      let exportedContent: string = content;
      
      switch (format) {
        case 'txt':
          if (content.includes('<html>')) {
            const $ = cheerio.load(content);
            exportedContent = $('body').text().trim();
          }
          break;
          
        case 'html':
          if (!content.includes('<html>')) {
            exportedContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Marathon Export</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
        ${options.styling === 'georgian' ? 'font-family: "BPG Nino Mtavruli", Arial, sans-serif;' : ''}
    </style>
</head>
<body>
    <pre>${content}</pre>
</body>
</html>`;
          }
          break;
          
        case 'json':
          exportedContent = JSON.stringify({
            source,
            content,
            exported_at: new Date().toISOString(),
            options
          }, null, 2);
          break;
          
        case 'pdf':
        case 'docx':
          return {
            status: 'error',
            message: `❌ ${format.toUpperCase()} ფორმატი ჯერ არ არის დაიმპლემენტებული`,
            format,
            suggestion: 'გამოიყენეთ HTML ან TXT ფორმატი'
          };
      }
      
      // Write to output file
      await fs.writeFile(output_path, exportedContent, 'utf-8');
      
      return {
        status: 'success',
        message: `✅ კონტენტი წარმატებით ექსპორტდა: ${format.toUpperCase()}`,
        source,
        format,
        output_path,
        output_size: exportedContent.length,
        options,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ ექსპორტის შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'}`,
        source,
        format,
        output_path
      };
    }
  }

  // Helper methods
  private generateDocId(url: string): string {
    return url.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50);
  }

  private htmlToMarkdown(html: string): string {
    // Simple HTML to Markdown conversion
    return html
      .replace(/<h([1-6])>(.*?)<\/h[1-6]>/g, (_, level, content) => {
        const prefix = '#'.repeat(parseInt(level));
        return `${prefix} ${content}\n\n`;
      })
      .replace(/<p>(.*?)<\/p>/g, '$1\n\n')
      .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
      .replace(/<em>(.*?)<\/em>/g, '*$1*')
      .replace(/<a.*?href="(.*?)".*?>(.*?)<\/a>/g, '[$2]($1)')
      .replace(/<[^>]*>/g, '')
      .trim();
  }

  private applyGeorgianTemplate(markdown: string): string {
    return `<!-- ქართული დოკუმენტაცია -->\n\n${markdown}\n\n---\n\n*შექმნილია Marathon MCP Tool-ით 🇬🇪*`;
  }

  private applyTechnicalTemplate(markdown: string): string {
    return `<!-- Technical Documentation -->\n\n${markdown}\n\n## See Also\n\n- Related documentation\n- API Reference\n- Examples\n\n---\n\n*Generated by Marathon MCP Tool*`;
  }

  private applyApiTemplate(markdown: string): string {
    return `<!-- API Documentation -->\n\n${markdown}\n\n## Quick Start\n\n\`\`\`bash\n# Example usage\n\`\`\`\n\n## Response Format\n\n\`\`\`json\n{\n  "status": "success",\n  "data": {}\n}\n\`\`\`\n\n---\n\n*API Documentation - Marathon MCP Tool*`;
  }

  private applyTutorialTemplate(markdown: string): string {
    return `<!-- Tutorial -->\n\n${markdown}\n\n## What You Learned\n\n- Key concepts\n- Best practices\n- Next steps\n\n---\n\n*Tutorial - Marathon MCP Tool*`;
  }
}