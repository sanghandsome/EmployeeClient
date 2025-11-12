import { makeAutoObservable, runInAction } from "mobx";
import {
  pagingCountries,
  createCountry as apiCreateCountry,
  editCountry as apiUpdateCountry,
  deleteCountry as apiDeleteCountry
} from "../services/ContryService";

class CountryStore {
  countryList = [];
  loading = false;
  pageIndex = 0;
  pageSize = 5;
  totalCount = 0;
  keyword = "";

  constructor() {
    makeAutoObservable(this);
  }

  /** READ: Lấy danh sách countries */
  async fetchCountries() {
    this.loading = true;
    try {
      const res = await pagingCountries(this.pageIndex, this.pageSize, this.keyword);
      runInAction(() => {
        this.countryList = res?.data || [];
        this.totalCount = res?.totalCount || 0;
      });
    } catch (e) {
      runInAction(() => {
        this.countryList = [];
        this.totalCount = 0;
      });
      console.error("Load country list error:", e);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  /** CREATE: Thêm country mới */
  async createCountry(data) {
    this.loading = true;
    try {
      await apiCreateCountry(data);
      this.fetchCountries(); // reload danh sách
    } catch (e) {
      console.error("Create country error:", e);
    } finally {
      runInAction(() => (this.loading = false));
    }
  }

  /** UPDATE: Sửa country */
  async updateCountry(id, data) {
    this.loading = true;
    try {
      await apiUpdateCountry(id, data); // gọi editCountry từ service
      this.fetchCountries();
    } catch (e) {
      console.error("Update country error:", e);
    } finally {
      runInAction(() => (this.loading = false));
    }
  }

  /** DELETE: Xóa country */
  async deleteCountry(id) {
    const confirm = window.confirm("Bạn có chắc muốn xóa không?");
    if (!confirm) return; // Nếu bấm Hủy, dừng lại

    try {
        await apiDeleteCountry(id);
        this.fetchCountries(); // load lại danh sách
        return true; // trả về thành công
    } catch (error) {
        console.error(error);
        return false; // trả về thất bại
    }
    }

  /** SEARCH / FILTER */
  setKeyword(keyword) {
    this.keyword = keyword;
    this.pageIndex = 0;
    this.fetchCountries();
  }

  /** PAGINATION */
  setPageIndex(page) {
    this.pageIndex = page;
    this.fetchCountries();
  }

  setPageSize(size) {
    this.pageSize = size;
    this.pageIndex = 0;
    this.fetchCountries();
  }
}

export default new CountryStore();