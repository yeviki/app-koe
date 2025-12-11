2. Cara Pakai untuk Combobox Status

Ganti kode lama combobox menjadi seperti ini:

<Dropdown
  v-model="form.id_status"
  label="Status"
  url="/master/combo-status"
  label-field="status_name"
  value-field="id"
  placeholder="-- Pilih Status --"
/>


✨ Selesai!
Sekarang combobox status otomatis mengambil data dari backend.

🟩 3. Cara Pakai untuk Combobox Role (misal)
<Dropdown
  v-model="form.role_id"
  label="Role"
  url="/master/combo-role"
  label-field="role_name"
  value-field="id"
/>

🟨 4. Jika ingin pakai data statis
<Dropdown
  v-model="form.gender"
  label="Jenis Kelamin"
  :items="[
    { id: 'L', name: 'Laki-laki' },
    { id: 'P', name: 'Perempuan' }
  ]"
/>

🟧 5. Pakai di file Anda → ModulePage.vue

Import:

import Dropdown from "../components/Dropdown.vue";


Pakai di template:

<Dropdown
  v-model="form.id_status"
  label="Status"
  url="/master/combo-status"
  label-field="status_name"
  value-field="id"
/>

🎉 DONE

Dengan ini, semua combobox di aplikasi Anda kini:

✔ Konsisten
✔ Mudah dipakai ulang
✔ Rapi
✔ Bisa load dari API atau array statis


Cara Pakai Select2.vue
<Select2
  v-model="form.id_status"
  label="Status"
  url="/master/combo-status"
  label-field="status_name"
  value-field="id"
/>

Cara Pakai MultiSelect.vue
Contoh untuk memilih banyak role:
<MultiSelect
  v-model="form.role_ids"
  label="Pilih Role"
  url="/master/combo-role"
  label-field="role_name"
  value-field="id"
/>


👍 Output form.role_ids akan menjadi:

[1, 3, 5]

🎉 SEKARANG ANDA PUNYA 3 KOMPONEN REUSABLE
Komponen	Tipe	Fitur
Dropdown.vue	Single	Simple combobox
Select2.vue	Single (Searchable)	Mirip Select2 jQuery
MultiSelect.vue	Multiple	Searchable, badge, multiselect

Semua sudah:
✔ Dinamis dari API
✔ Bisa pakai array
✔ Reusable di semua module

✅ Cara Pakai combobox multiselect
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'

const controlsList = ref([]);
<!-- Cara Panggil Datanya -->
const loadControls = async () => {
  const r = await api.get("/control");
  controlsList.value = r.data; // pastikan format seperti API kamu
};
<!-- Set Bentuk Form -->
const formPermission = reactive({
  control_id: []   // array untuk multiselect
});
<label class="text-gray-300">Control</label>
  <Multiselect
    v-model="formPermission.control_id"
    :options="controlsList"
    :multiple="true"
    :close-on-select="false"
    :clear-on-select="false"
    label="label_control"
    track-by="id"
    placeholder="-- Pilih Control --"
    class="text-black"
  />
</div>

✅ Cara Pakai combobox manual
<div>
  <label class="text-sm text-gray-200">Role</label>
  <select
    v-model="form.roles_id"
    class="w-full px-3 py-2 rounded-lg bg-white text-black border border-gray-300"
  >
    <option value="1">Admin Super</option>
    <option value="2">Admin Local</option>
    <option value="3">Pimpinan</option>
    <option value="4">Pimpinan</option>
  </select>
</div>

✅ Cara pakai Dropdown
import Dropdown from "../components/Dropdown.vue";
<Dropdown
  v-model="form.roles_id"
  label="Pilih Roles Akses"
  url="/master/combo-roles"
  label-field="roles_name"
  value-field="id"
/>

✅ Cara pakai CheckboxGroup
import CheckboxGroup from "../components/CheckboxGroup.vue";
<CheckboxGroup
  v-model="form.permissions"
  label="Pilih Hak Akses"
  url="/master/combo-permissions"
  label-field="permission_name"
  value-field="id"
/>

✅ Cara pakai RadioGroup
import RadioGroup from "../components/RadioGroup.vue";
<RadioGroup
  v-model="form.status"
  label="Status User"
  name="status_user"
  url="/master/combo-status"
  label-field="status_name"
  value-field="id"
/>

✅ Cara pakai SearchLabelSelect
import SearchableSelect from "../components/SearchableSelect.vue";
<SearchableSelect
  v-model="form.id_status"
  label="Pilih User"
  url="/master/combo-status"
  label-field="status_name"
  value-field="id"
  placeholder="Cari user..."
/>