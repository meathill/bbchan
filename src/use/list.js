import each from 'lodash/each';
import { Query } from 'leancloud-storage';
import {reactive, ref} from "vue";

const perPage = 20;

export default function useList({
  model,
  rowFormatter,
  searchKey,
}) {
  const list = ref([]);
  const isLoading = ref(false);
  const page = ref(0);
  const hasNext = ref(false);
  const filter = reactive({
    column: {},
    search: '',
  });

  async function refresh(createdAt = '', direction) {
    isLoading.value = true;
    const query = new Query(model);
    if (createdAt) {
      if (direction) {
        query.lessThan('createdAt', createdAt);
      } else {
        query.greaterThan('createdAt', createdAt);
      }
    }
    if (filter.column) {
      each(filter.column, (value, key) => {
        query.equalTo(key, value);
      });
    } else if (filter.search) {
      query.contains(searchKey, filter.search);
    } else {
      query.exists('uid');
    }
    query
      .descending('createdAt')
      .limit(perPage);
    const result = await query.find();
    list.value = result.map(rowFormatter);
    hasNext.value = result.length >= perPage;
    isLoading.value = false;
  }
  function doPrev() {
    if (page.value > 0) {
      page.value = page.value - 1;
    }
    const createdAt = list.value[0].model.get('createdAt');
    refresh(createdAt, 0);
  }
  function doNext() {
    if (hasNext.value) {
      page.value = page.value + 1;
    }
    const createdAt = list.value[list.value.length - 1].model.get('createdAt');
    refresh(createdAt, 1);
  }

  return {
    list,
    isLoading,
    hasNext,
    filter,
    page,

    refresh,
    doPrev,
    doNext,
  };
}
