<!-- Skeleton.svelte -->
<script lang="ts">
    let { width = '100%', height = '1rem', className = ""} = $props();
</script>
  
<div class="skeleton overflow-hidden relative {className}" style={`width: ${width}; height: ${height};`}></div>
  
<style>

  .skeleton::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    animation: shimmer 1.5s infinite;
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
</style>