# Cloudflare Pages D1 Binding Configuration

The D1 database binding needs to be configured in the Cloudflare Dashboard:

1. Go to https://dash.cloudflare.com
2. Navigate to Workers & Pages > Pages > latino-leaders-2026
3. Go to Settings > Functions
4. Under "D1 Database bindings", click "Add binding"
5. Set:
   - Variable name: DB
   - D1 Database: young-latino-candidates
6. Save

Alternatively, you can use wrangler CLI to update the binding.

The wrangler.toml already has the configuration, but it needs to be applied to the Pages project.
