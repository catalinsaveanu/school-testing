<template>
  <component v-bind:is="componentName"></component>
</template>


<script>
import StudentDashboard from './StudentDashboard';
import AdminDashboard from './AdminDashboard';

export default {
  name: 'UserDashboard',
  components: {
    StudentDashboard,
    AdminDashboard
  },
  data() {
    return {
      componentName:
        this.$store.getters.getUser.role === 'admin'
          ? 'AdminDashboard'
          : 'StudentDashboard'
    };
  }
};
</script>