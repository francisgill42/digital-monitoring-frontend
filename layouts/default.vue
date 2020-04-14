<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      dark
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
      class="primary"   
      >
<!-- color="#00695C" -->

       <v-list v-if="this.$auth.user &&  (this.$auth.user.role_id == 3 || this.$auth.user.master == 1)">
        <v-list-item
          v-for="(item, i) in leads"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon class="white--text">{{ item.icon }}</v-icon>
          </v-list-item-action>
           <v-list-item-content>
            <v-list-item-title class="white--text"  v-text="item.title"/>
          </v-list-item-content>
        </v-list-item>
      </v-list>

        <v-list v-else>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon class="white--text">{{ item.icon }}</v-icon>
          </v-list-item-action>
           <v-list-item-content>
             <v-list-item-title class="white--text"  v-text="item.title"/>
          </v-list-item-content>
        </v-list-item>
      </v-list>



       
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
      color="white"
      
    >
      <v-app-bar-nav-icon color="black--text"  @click.stop="drawer = !drawer" />
      {{title}}
      <v-spacer />
      <span v-if="this.$auth.user" >
      Welcome, <b>{{this.$auth.user.name}}</b>
      <!-- {{this.$auth.user}} -->
      <v-btn text @click="logout">      

        {{logout_btn.label}}
        <v-icon >{{ logout_btn.icon }}</v-icon>
      </v-btn>
     </span>
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
   
    <v-footer
      :fixed="fixed"
      app
    >
      <span>&copy; {{year}}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {

  mounted () {
    
  },
  data () {
    return {
      year: new Date().getFullYear(),
      clipped: false,
      drawer: true,
      fixed: false,
      items: [
          {
          icon: 'mdi-apps',
          title: 'Home',
          to: '/'
          },
          {
          icon: 'mdi-chart-bubble',
          title: 'Tasks',
          to: '/task'
          },
          {
          icon: 'mdi-chart-bubble',
          title: 'Activity',
          to: '/activity'
          },
      ],
      
      leads: [
          {
          icon: 'mdi-apps',
          title: 'Home',
          to: '/'
          },
          {
          icon: 'mdi-chart-bubble',
          title: 'Progresses',
          to: '/progress'
          },
          {
          icon: 'mdi-chart-bubble',
          title: 'Clients',
          to: '/client'
          },
          {
          icon: 'mdi-chart-bubble',
          title: 'Projects',
          to: '/project'
          },
          {
          icon: 'mdi-chart-bubble',
          title: 'Tasks',
          to: '/task'
          },
          {
          icon: 'mdi-chart-bubble',
          title: 'User',
          to: '/user'
          },
          {
          icon: 'mdi-chart-bubble',
          title: 'Activity',
          to: '/activity'
          },
          {
          icon: 'mdi-chart-bubble',
          title: 'Role',
          to: '/role'
          },
          {
          icon: 'mdi-chart-bubble',
          title: 'Status',
          to: '/status'
          },
      ],
      
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Digital Monitoring',
      logout_btn:{
        icon:'mdi-logout',
        label:'Logout'
      }
    }
  },
  methods:{
  async logout() {
    this.items = [];
    this.leads = [];
    await this.$auth.logout();
  },
  }
}
</script>
<style>
@media print{
    .no_print{
        display: none;
        }
}
</style>
