// react itu bungkus HTML ke dalam JS
// 1 file jsx itu punya 1 fuction utama
// 1 fuction utama dinyatakan dengan Default
// 1 function harus return 1 tag, tidak boleh lebih

function Home() {
    return <div>
        <Judul />
        <Isi />
    </div>;
}

function Judul() {
    return <h1 class="text-3xl font-bold underline">Aku dan Kamu</h1>;
}

function Isi() {
    return <p>haii aku Rhafly dan aku lahir di Semarang pada 02 Agustus 2005, dan aku memiliki pasangan yangg sangat menyayangi aku</p>;
}

export default Home;