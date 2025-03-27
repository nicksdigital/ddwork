<template>
    <Button @click="signIn('github')">
        <Icon name="uil:github" class="w-6 h-6" />
        <span>Continue with GitHub</span>
    </Button>
</template>

<script setup>


const { signIn } = useAuth();
</script>
