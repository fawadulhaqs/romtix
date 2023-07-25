<script>
export default {
  props: {
    item: Object,
  },
};
</script>

<template>
  <v-list-item
          v-if="!item.children"
          :to="item.to"
          rounded
          active-color="primary"
        >
          <v-list-item-title class="text-overline" v-text="item.title"></v-list-item-title>
        </v-list-item>
        <v-list-group v-else :key="item.title" no-action>
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props">
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item>
          </template>
          <v-list-item
            v-for="(subPages, i ) in item.children"
            :key="i"
            :title="subPages.title"
            :to="subPages.to"
            rounded
            class="overline"
            active-class="primary"
          ></v-list-item>
        </v-list-group>
</template>

<style>
.nav_bar{
    font-size: 13px;
    text-transform: capitalize;
}
</style>
