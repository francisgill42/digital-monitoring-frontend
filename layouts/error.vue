<template>
<v-app>
   <v-snackbar
      v-model="snackbar"
      :top="'top'"
      color="red"
    >
      {{msg}}
      <v-btn      
        text
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
<v-content>
<v-container
class=""
>
<v-row
justify="center"
>
<v-col
cols="12"
sm="8"
md="6"
>
<v-card class="elevation-12">
     
<v-toolbar color="" dark flat>
<v-toolbar-title class="white--text">Page not found</v-toolbar-title>
</v-toolbar>
<v-card-text>

Error Page

</v-card-text>
</v-card>
</v-col>
</v-row>
</v-container>
</v-content>
</v-app>
</template>
<script>
export default {
layout:'error-layout'
}
</script>
