export interface Snippet {
  id: string;
  name: string;
  description: string;
  language: string;
  category: string;
  code: string;
  prefix?: string;
}

export const builtinSnippets: Snippet[] = [
  // JavaScript
  {
    id: "js-arrow-function",
    name: "Arrow Function",
    description: "Create an arrow function",
    language: "javascript",
    category: "Functions",
    prefix: "af",
    code: `const functionName = (params) => {
  // TODO: implement
  return result;
};`,
  },
  {
    id: "js-async-arrow",
    name: "Async Arrow Function",
    description: "Create an async arrow function",
    language: "javascript",
    category: "Functions",
    prefix: "aaf",
    code: `const functionName = async (params) => {
  try {
    const result = await someAsyncOperation();
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};`,
  },
  {
    id: "js-fetch-api",
    name: "Fetch API",
    description: "Fetch data from API",
    language: "javascript",
    category: "HTTP",
    prefix: "fetch",
    code: `const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};`,
  },
  {
    id: "js-promise-all",
    name: "Promise.all",
    description: "Execute multiple promises in parallel",
    language: "javascript",
    category: "Async",
    prefix: "pall",
    code: `const results = await Promise.all([
  promise1(),
  promise2(),
  promise3(),
]);`,
  },
  {
    id: "js-debounce",
    name: "Debounce",
    description: "Debounce function implementation",
    language: "javascript",
    category: "Utilities",
    prefix: "debounce",
    code: `const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};`,
  },

  // TypeScript
  {
    id: "ts-interface",
    name: "Interface",
    description: "Create a TypeScript interface",
    language: "typescript",
    category: "Types",
    prefix: "int",
    code: `interface InterfaceName {
  property: type;
  method(param: type): returnType;
}`,
  },
  {
    id: "ts-enum",
    name: "Enum",
    description: "Create a TypeScript enum",
    language: "typescript",
    category: "Types",
    prefix: "enum",
    code: `enum EnumName {
  VALUE1 = "value1",
  VALUE2 = "value2",
  VALUE3 = "value3",
}`,
  },
  {
    id: "ts-generic-function",
    name: "Generic Function",
    description: "Create a generic function",
    language: "typescript",
    category: "Functions",
    prefix: "gf",
    code: `function functionName<T>(param: T): T {
  // TODO: implement
  return param;
}`,
  },

  // Python
  {
    id: "py-class",
    name: "Class",
    description: "Create a Python class",
    language: "python",
    category: "Classes",
    prefix: "cls",
    code: `class ClassName:
    def __init__(self, param):
        self.param = param

    def method(self):
        # TODO: implement
        pass`,
  },
  {
    id: "py-dataclass",
    name: "Dataclass",
    description: "Create a Python dataclass",
    language: "python",
    category: "Classes",
    prefix: "dc",
    code: `from dataclasses import dataclass

@dataclass
class ClassName:
    field1: str
    field2: int
    field3: bool = False`,
  },
  {
    id: "py-decorator",
    name: "Decorator",
    description: "Create a Python decorator",
    language: "python",
    category: "Functions",
    prefix: "deco",
    code: `def decorator(func):
    def wrapper(*args, **kwargs):
        # Before function call
        result = func(*args, **kwargs)
        # After function call
        return result
    return wrapper`,
  },
  {
    id: "py-context-manager",
    name: "Context Manager",
    description: "Create a context manager",
    language: "python",
    category: "Utilities",
    prefix: "ctx",
    code: `from contextlib import contextmanager

@contextmanager
def managed_resource():
    # Setup
    resource = acquire_resource()
    try:
        yield resource
    finally:
        # Cleanup
        release_resource(resource)`,
  },

  // React
  {
    id: "react-component",
    name: "React Component",
    description: "Create a React functional component",
    language: "typescriptreact",
    category: "React",
    prefix: "rc",
    code: `"use client";

import { useState } from "react";

interface Props {
  // define props
}

export function ComponentName({ }: Props) {
  const [state, setState] = useState(initialValue);

  return (
    <div>
      {/* Component content */}
    </div>
  );
}`,
  },
  {
    id: "react-hook",
    name: "Custom Hook",
    description: "Create a custom React hook",
    language: "typescriptreact",
    category: "React",
    prefix: "hook",
    code: `"use client";

import { useState, useCallback } from "react";

export function useHookName() {
  const [state, setState] = useState(initialValue);

  const action = useCallback(() => {
    // TODO: implement
  }, []);

  return { state, action };
}`,
  },

  // Next.js
  {
    id: "next-api-route",
    name: "API Route",
    description: "Create a Next.js API route",
    language: "typescript",
    category: "Next.js",
    prefix: "api",
    code: `import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // TODO: implement
    return NextResponse.json({ data: "response" });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // TODO: implement
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}`,
  },
  {
    id: "next-server-component",
    name: "Server Component",
    description: "Create a Next.js server component",
    language: "typescriptreact",
    category: "Next.js",
    prefix: "sc",
    code: `import { Suspense } from "react";

export default async function Page() {
  const data = await fetchData();

  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        {/* Content */}
      </Suspense>
    </main>
  );
}

async function fetchData() {
  // TODO: implement
  return {};
}`,
  },

  // SQL
  {
    id: "sql-select",
    name: "SELECT",
    description: "SQL SELECT query",
    language: "sql",
    category: "SQL",
    prefix: "sel",
    code: `SELECT column1, column2
FROM table_name
WHERE condition
ORDER BY column1
LIMIT 10;`,
  },
  {
    id: "sql-join",
    name: "JOIN",
    description: "SQL JOIN query",
    language: "sql",
    category: "SQL",
    prefix: "join",
    code: `SELECT t1.column1, t2.column2
FROM table1 t1
INNER JOIN table2 t2 ON t1.id = t2.table1_id
WHERE condition;`,
  },

  // Docker
  {
    id: "docker-node",
    name: "Node.js Dockerfile",
    description: "Dockerfile for Node.js",
    language: "dockerfile",
    category: "Docker",
    prefix: "dnode",
    code: `FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000
CMD ["node", "index.js"]`,
  },
  {
    id: "docker-python",
    name: "Python Dockerfile",
    description: "Dockerfile for Python",
    language: "dockerfile",
    category: "Docker",
    prefix: "dpy",
    code: `FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000
CMD ["python", "app.py"]`,
  },
];
