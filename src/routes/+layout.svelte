<script>
  import { page } from "$app/stores";
  import { fade } from "svelte/transition";
  import "../app.css";
  import Header from "$lib/components/Header.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import SEO from "$lib/components/SEO.svelte";
  import EdgeCaseHandler from "$lib/components/EdgeCaseHandler.svelte";
  import PageWrapper from "$lib/components/PageWrapper.svelte";

  const IS_PROD = import.meta.env.PROD;
</script>

<svelte:head>
  <!-- Performance optimizations -->
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1, viewport-fit=cover"
  />
</svelte:head>

<SEO />

<EdgeCaseHandler>
  <div class="app">
    <Header />

    <main class="main" id="main-content" tabindex="-1">
      <PageWrapper>
        <div
          class="page-transition"
          in:fade={{ duration: 200 }}
          out:fade={{ duration: 200 }}
        >
          <slot />
        </div>
      </PageWrapper>
    </main>

    <Footer />
  </div>
</EdgeCaseHandler>

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .main {
    flex: 1;
    width: 100%;
    padding-top: 4.5rem;
  }

  /* Page wrapper handled by src/lib/components/PageWrapper.svelte */
</style>
