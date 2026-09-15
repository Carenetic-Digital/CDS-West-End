// No-op-ish stub for @sparkable-cms/cms/content — used only when the CMS
// package is not installed (token-less dev / stubbed build). Reproduces the
// real blogSchema() zod shape closely enough that the committed posts validate
// and render. Mirrors the CMS's field-type → zod mapping.

interface BlogFieldDef {
  key: string;
  type: string;
  default?: unknown;
  optional?: boolean;
  options?: { value: string; label: string }[];
}

function fieldZod(z: any, field: BlogFieldDef): any {
  switch (field.type) {
    case 'textarea':
      return z.string().default(typeof field.default === 'string' ? field.default : '');
    case 'text':
      if (field.optional) return z.string().optional();
      return z.string().default(typeof field.default === 'string' ? field.default : '');
    case 'select': {
      const values = (field.options ?? []).map((o) => o.value);
      const def =
        typeof field.default === 'string' && values.includes(field.default)
          ? field.default
          : values[0];
      return z.enum(values as [string, ...string[]]).catch(def);
    }
    case 'date':
      return z.coerce.date();
    case 'boolean':
      return z.boolean().default(field.default === true);
    case 'image':
      return z
        .object({ src: z.string().default(''), alt: z.string().default('') })
        .default({ src: '', alt: '' });
    case 'related':
      return z.array(z.string()).default([]);
    case 'readtime':
      return z.string().default('');
    default:
      return z.string().default('');
  }
}

export function blogSchema(z: any, fields?: BlogFieldDef[]) {
  const resolved = Array.isArray(fields) && fields.length ? fields : [];
  const shape: Record<string, any> = { title: z.string().min(1) };
  for (const field of resolved) shape[field.key] = fieldZod(z, field);
  shape.body = z.string().default('');
  shape.draft = z.boolean().default(false);
  return z.object(shape);
}
