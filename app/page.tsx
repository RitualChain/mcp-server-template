"use client"

import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://your-app.vercel.app"

  const mcpUrl = `${baseUrl}/mcp`
  const [copied, setCopied] = useState(false)
  const [exampleCopied, setExampleCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(mcpUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const examplePrompt = "Create a new tool in /app/mcp/route.ts that gets the first 3 pokemon from https://pokeapi.co/"

  const copyExampleToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(examplePrompt)
      setExampleCopied(true)
      setTimeout(() => setExampleCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 leading-relaxed">
      <h1 className="text-4xl font-bold mb-8">MCP Server Template</h1>

      <p className="text-lg text-muted-foreground mb-8">
        This is a Model Context Protocol (MCP) server template that you can deploy and use with any MCP-compatible
        client.
      </p>

      <div className="bg-muted/50 border border-border rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6">Setup Guide</h2>

        <div className="space-y-6">
          {/* Step 1 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
              1
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Publish this app to production</h3>
              <p className="text-sm text-muted-foreground">
                Deploy your MCP server to Vercel by clicking the "Publish" button in the top right corner.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
              2
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Add the Vercel production URL as an environment variable</h3>
              <p className="text-sm text-muted-foreground mb-2">
                In your Vercel project settings, add{" "}
                <code className="bg-background px-1.5 py-0.5 rounded text-xs font-mono">NEXT_PUBLIC_VERCEL_URL</code>{" "}
                with your production URL as the value.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
              3
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-3">Copy and paste your MCP URL in your agent of choice</h3>

              {/* MCP URL Display */}
              <div className="relative group mb-4">
                <code className="block bg-background px-4 py-3 pr-24 rounded border border-border font-mono text-sm break-all">
                  {mcpUrl}
                </code>
                <button
                  onClick={copyToClipboard}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>

              {/* Accordion for different clients */}
              <Accordion type="single" collapsible className="w-full max-w-full">
                <AccordionItem value="chatgpt">
                  <AccordionTrigger className="text-sm font-medium cursor-pointer">ChatGPT</AccordionTrigger>
                  <AccordionContent className="max-w-full overflow-hidden">
                    <div className="text-sm text-muted-foreground space-y-4">
                      <p className="font-medium text-foreground">To add this MCP server to ChatGPT:</p>

                      <div className="space-y-4">
                        <div>
                          <p className="mb-2">
                            <span className="font-semibold text-foreground">1.</span> Click on your profile icon and
                            select <strong>Settings</strong>
                          </p>
                          <img
                            src="/images/chatgpt-user-menu.png"
                            alt="ChatGPT user menu"
                            className="rounded-lg border border-border max-w-full h-auto"
                          />
                        </div>

                        <div>
                          <p className="mb-2">
                            <span className="font-semibold text-foreground">2.</span> Navigate to{" "}
                            <strong>Apps & Connectors</strong>
                          </p>
                          <img
                            src="/images/chatgpt-settings.png"
                            alt="ChatGPT settings menu"
                            className="rounded-lg border border-border max-w-full h-auto"
                          />
                        </div>

                        <div>
                          <p className="mb-2">
                            <span className="font-semibold text-foreground">3.</span> View your enabled connectors and
                            click <strong>Create</strong>
                          </p>
                          <img
                            src="/images/chatgpt-connectors-menu.png"
                            alt="ChatGPT Apps & Connectors menu"
                            className="rounded-lg border border-border max-w-full h-auto"
                          />
                        </div>

                        <div>
                          <p className="mb-2">
                            <span className="font-semibold text-foreground">4.</span> Fill in the form with your MCP
                            server details:
                          </p>
                          <ul className="list-disc list-inside space-y-1 ml-2 mb-2">
                            <li>Name: Your MCP server name</li>
                            <li>Description: Brief description of what your server does</li>
                            <li className="break-words">
                              MCP Server URL:{" "}
                              <code className="bg-background px-1.5 py-0.5 rounded text-xs font-mono break-all inline-block max-w-full">
                                {mcpUrl}
                              </code>
                            </li>
                            <li>Authentication: No authentication</li>
                            <li>Check "I understand and want to continue"</li>
                          </ul>
                          <img
                            src="/images/chatgpt-new-connector-form.png"
                            alt="ChatGPT new connector form"
                            className="rounded-lg border border-border max-w-full h-auto"
                          />
                        </div>

                        <div>
                          <p className="mb-2">
                            <span className="font-semibold text-foreground">5.</span> Your connector will now appear in
                            the enabled connectors list
                          </p>
                          <img
                            src="/images/chatgpt-enabled-connectors.png"
                            alt="ChatGPT enabled connectors"
                            className="rounded-lg border border-border max-w-full h-auto"
                          />
                        </div>

                        <div>
                          <p className="mb-2">
                            <span className="font-semibold text-foreground">6.</span> Select your new custom MCP
                            connector and ask ChatGPT what tools it has available
                          </p>
                          <img
                            src="/images/chatgpt-test-tools.png"
                            alt="Testing MCP connector in ChatGPT"
                            className="rounded-lg border border-border max-w-full h-auto"
                          />
                        </div>

                        <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3 mt-4">
                          <p className="text-sm text-green-900 dark:text-green-100">
                            ✓ You can now use your MCP server tools in ChatGPT conversations!
                          </p>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 border border-border rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Available Tools</h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="text-primary font-mono text-sm mt-1">echo</span>
            <span className="text-muted-foreground">Echoes back a message to verify communication</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary font-mono text-sm mt-1">get_server_time</span>
            <span className="text-muted-foreground">Returns the current server time and timezone</span>
          </li>
        </ul>
      </div>

      <div className="bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Tools</h2>
        <p className="text-muted-foreground mb-4">
          To create a new tool, simply prompt this template with the new tool you would like to create.
        </p>
        <div className="bg-background border border-border rounded-lg p-4 relative group mb-4">
          <p className="text-sm font-medium text-muted-foreground mb-2">Example prompt:</p>
          <code className="text-sm font-mono text-foreground block pr-20">{examplePrompt}</code>
          <button
            onClick={copyExampleToClipboard}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded hover:bg-primary/90 transition-colors cursor-pointer"
          >
            {exampleCopied ? "Copied!" : "Copy"}
          </button>
        </div>
        <div className="bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-800 rounded-lg p-4 mt-4">
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">Important:</p>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            After adding a new tool, you need to push the tool to production by redeploying your app to Vercel. Your MCP
            clients will then be able to use the new tool.
          </p>
        </div>

        <div className="mt-6">
          <Accordion type="single" collapsible className="w-full max-w-full">
            <AccordionItem value="chatgpt-test">
              <AccordionTrigger className="text-sm font-medium cursor-pointer">
                How to test your new tool in ChatGPT
              </AccordionTrigger>
              <AccordionContent className="max-w-full overflow-hidden">
                <div className="text-sm text-muted-foreground space-y-3">
                  <p className="font-medium text-foreground">After deploying your new tool:</p>
                  <ol className="list-decimal list-inside space-y-4 ml-2">
                    <li>
                      <span className="font-semibold text-foreground">Re-publish the app</span> - After you have created
                      your new tool you need to re-publish the app again so that ChatGPT can find it.
                    </li>
                    <li>
                      <div className="space-y-2">
                        <p>
                          <span className="font-semibold text-foreground">Refresh your connector</span> - Go to ChatGPT
                          and open the connector configuration in your settings and click the <strong>"Refresh"</strong>{" "}
                          button to see your new tools.
                        </p>
                        <div className="space-y-2 mt-3">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              Before refresh (only old tools visible):
                            </p>
                            <img
                              src="/images/chatgpt-connector-before-refresh.png"
                              alt="ChatGPT connector before refresh showing only original tools"
                              className="rounded-lg border border-border max-w-full h-auto"
                            />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              Click the Refresh button (loading state):
                            </p>
                            <img
                              src="/images/chatgpt-connector-refreshing.png"
                              alt="ChatGPT connector refreshing with loading spinner"
                              className="rounded-lg border border-border max-w-full h-auto"
                            />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">After refresh (new tool appears):</p>
                            <img
                              src="/images/chatgpt-connector-after-refresh.png"
                              alt="ChatGPT connector after refresh showing new tool"
                              className="rounded-lg border border-border max-w-full h-auto"
                            />
                          </div>
                        </div>
                      </div>
                    </li>
                  </ol>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  )
}
