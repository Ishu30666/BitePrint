"use client";

import React, { useRef, useState } from "react";
import "./styles.css";

const today = new Date().toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const initialForm = {
  OfficeTyp: "DHBVN",

  // Page 1: Deceased account holder
  applicantName: "कर्ण यादव",
  applicantFather: "धर्मबीर",
  village: "भानगढ़",
  tehsil: "भिवानी",
  district: "भिवानी",
  state: "हरियाणा",
  accountNo: "8663504000",
  currentHolder: "धर्मबीर",
  currentHolderFather: "गोपाल",
  date: today,
  place: "भिवानी",

  // Page 2: Consent affidavit
  consentHolder: "राजेंदर सिंह",
  consentHolderFather: "हरपत सिंह",
  consentVillage: "भानगढ़",
  consentTehsil: "भिवानी",
  consentDistrict: "भिवानी",
  consentState: "हरियाणा",
  consentAccountNo: "8663504000",
  transferName: "सुधीर कुमार",
  transferFather: "राजेंदर सिंह",
  consentDate: today,
  consentPlace: "भिवानी",
};

export default function AffidavitPrint() {
  const [form, setForm] = useState(initialForm);
  const [downloading, setDownloading] = useState(false);

  const pdfRef = useRef(null);

  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm({ ...initialForm });
  };

  const downloadPdf = async () => {
  if (!pdfRef.current || downloading) return;

  setDownloading(true);

  try {
    const html2pdfModule = await import("html2pdf.js");
    const html2pdf = html2pdfModule.default;

    await html2pdf()
      .set({
        margin: 0,

        filename: `Electricity_Affidavit_${
          (form.applicantName || "Applicant").replace(
            /[^\p{L}\p{N}_-]/gu,
            "_"
          )
        }.pdf`,

        image: {
          type: "jpeg",
          quality: 0.98,
        },

        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false,
          scrollX: 0,
          scrollY: 0,
        },

        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
          compress: true,
        },

        // Do not add another manual page break here.
        pagebreak: {
          mode: [],
        },
      })
      .from(pdfRef.current)
      .save();
  } catch (error) {
    console.error("PDF generation failed:", error);
    window.alert("Unable to generate PDF. Please try again.");
  } finally {
    setDownloading(false);
  }
};
  const Field = ({ label, name }) => (
    <label className="form-field">
      <span>{label}</span>
      <input
        type="text"
        name={name}
        value={form[name] ?? ""}
        onChange={updateField}
      />
    </label>
  );

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <h1>Electricity Affidavit Generator</h1>
          <p>
            Edit the details and download both affidavit pages as one PDF.
          </p>
        </div>

        <div className="topbar-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={resetForm}
          >
            Reset
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={downloadPdf}
            disabled={downloading}
          >
            {downloading ? "Generating PDF..." : "Download Both Pages"}
          </button>
        </div>
      </header>

      <main className="layout">
        {/* LEFT: FORM */}
        <section className="editor">
          <div className="section-heading">
            <h2>Application Details</h2>
            <p>Changes update the live preview automatically.</p>
          </div>

          <div className="form-card">
            <h3>Electricity Board</h3>

            <label className="form-field">
              <span>Select Board</span>

              <select
                name="OfficeTyp"
                value={form.OfficeTyp}
                onChange={updateField}
              >
                <option value="DHBVN">DHBVN</option>
                <option value="UHBVN">UHBVN</option>
              </select>
            </label>
          </div>

          {/* PAGE 1 FIELDS */}
          <div className="form-card">
            <div className="form-title">
              <span className="page-number">01</span>
              <div>
                <h3>Deceased Account Holder</h3>
                <p>First affidavit details</p>
              </div>
            </div>

            <div className="form-grid">
              <Field label="Applicant Name" name="applicantName" />
              <Field label="Applicant Father's Name" name="applicantFather" />
              <Field label="Village" name="village" />
              <Field label="Tehsil" name="tehsil" />
              <Field label="District" name="district" />
              <Field label="State" name="state" />
              <Field label="Account Number" name="accountNo" />
              <Field label="Deceased Account Holder" name="currentHolder" />
              <Field
                label="Deceased Father's Name"
                name="currentHolderFather"
              />
              <Field label="Date" name="date" />
              <Field label="Place" name="place" />
            </div>
          </div>

          {/* PAGE 2 FIELDS */}
          <div className="form-card">
            <div className="form-title">
              <span className="page-number">02</span>
              <div>
                <h3>Consent Affidavit</h3>
                <p>Second affidavit details</p>
              </div>
            </div>

            <div className="form-grid">
              <Field label="Existing Account Holder" name="consentHolder" />
              <Field
                label="Account Holder Father's Name"
                name="consentHolderFather"
              />
              <Field label="Village" name="consentVillage" />
              <Field label="Tehsil" name="consentTehsil" />
              <Field label="District" name="consentDistrict" />
              <Field label="State" name="consentState" />
              <Field label="Account Number" name="consentAccountNo" />
              <Field label="Person Receiving Connection" name="transferName" />
              <Field label="Recipient Father's Name" name="transferFather" />
              <Field label="Date" name="consentDate" />
              <Field label="Place" name="consentPlace" />
            </div>
          </div>

          <button
            type="button"
            className="btn btn-primary download-full"
            onClick={downloadPdf}
            disabled={downloading}
          >
            {downloading
              ? "Generating PDF..."
              : "Download Complete Two-Page PDF"}
          </button>
        </section>

        {/* RIGHT: BOTH AFFIDAVIT PAGES */}
        <section className="preview-section">
          <div className="preview-heading">
            <div>
              <h2>Live Preview</h2>
              <p>Both affidavit pages are included in the download.</p>
            </div>
            <span className="page-count">2 Pages</span>
          </div>

          <div className="preview-scroll">
            <div ref={pdfRef} className="pdf-document">
              {/* ================= PAGE 1 ================= */}
              <article className="affidavit-page pdf-page-1">
                <div className="affidavit-content">
                  <h2 className="affidavit-title">शपथपत्र</h2>
                  <h3 className="affidavit-subtitle">AFFIDAVIT</h3>
                  <h3 className="affidavit-subtitle">
                    (बिजली कनेक्शन के नाम सुधार हेतु – {form.OfficeTyp})
                  </h3>

                  <p className="affidavit-paragraph">
                    मैं, <strong>{form.applicantName}</strong>, पुत्र/पुत्री
                    श्री <strong>{form.applicantFather}</strong>, निवासी गाँव{" "}
                    <strong>{form.village}</strong>, तहसील{" "}
                    <strong>{form.tehsil}</strong>, जिला{" "}
                    <strong>{form.district}</strong>, राज्य{" "}
                    <strong>{form.state}</strong>, शपथपूर्वक निम्नलिखित कथन
                    करता/करती हूँ:
                  </p>

                  <p>
                    1. यह कि बिजली कनेक्शन/खाता संख्या{" "}
                    <strong>{form.accountNo}</strong> वर्तमान में मेरे
                    स्वर्गीय पिता/परिवार के सदस्य श्री{" "}
                    <strong>{form.currentHolder}</strong>, पुत्र श्री{" "}
                    <strong>{form.currentHolderFather}</strong>, के नाम पर
                    दर्ज है।
                  </p>

                  <p>
                    2. यह कि उक्त खाताधारक का देहांत हो चुका है। मैं उनका
                    कानूनी वारिस/दावेदार हूँ तथा उक्त बिजली कनेक्शन को अपने
                    नाम पर स्थानांतरित करवाना चाहता/चाहती हूँ।
                  </p>

                  <p>
                    3. यह कि मेरे द्वारा प्रस्तुत की गई जानकारी मेरे ज्ञान एवं
                    विश्वास के अनुसार सत्य एवं सही है। कोई भी तथ्य जानबूझकर
                    छिपाया नहीं गया है।
                  </p>

                  <p>
                    4. यह कि उक्त बिजली कनेक्शन के संबंध में भविष्य में कोई
                    विवाद उत्पन्न होने पर उसकी जिम्मेदारी मेरी होगी।
                  </p>

                  <p>
                    5. यह कि उक्त बिजली कनेक्शन से संबंधित बकाया राशि, यदि कोई
                    हो, के भुगतान की जिम्मेदारी मेरी होगी।
                  </p>

                  <p>
                    अतः निवेदन है कि उपरोक्त तथ्यों के आधार पर बिजली
                    कनेक्शन/खाता संख्या <strong>{form.accountNo}</strong> को
                    मेरे नाम पर स्थानांतरित करने की कृपा की जाए।
                  </p>

                  <div className="signature-area">
                    <p>
                      दिनांक: <strong>{form.date}</strong>
                    </p>
                    <p>
                      स्थान: <strong>{form.place}</strong>
                    </p>

                    <div className="signature">
                      <strong>शपथकर्ता / Deponent</strong>
                      <span>{form.applicantName}</span>
                      <span>पुत्र/पुत्री श्री {form.applicantFather}</span>
                    </div>
                  </div>

                  <div className="verification">
                    <h3>सत्यापन / VERIFICATION</h3>
                    <p>
                      मैं सत्यापित करता/करती हूँ कि इस शपथपत्र में लिखे गए
                      कथन मेरे ज्ञान एवं विश्वास के अनुसार सत्य और सही हैं
                      तथा इनमें कोई तथ्य असत्य नहीं है और न ही कोई महत्वपूर्ण
                      तथ्य छिपाया गया है।
                    </p>

                    <div className="verification-bottom">
                      <span>स्थान: {form.place}</span>
                      <span>दिनांक: {form.date}</span>
                    </div>

                    <div className="verification-signature">
                      हस्ताक्षर: __________________
                    </div>
                  </div>
                </div>
              </article>

              {/* ================= PAGE 2 ================= */}
              <article className="affidavit-page pdf-page-2">
                <div className="affidavit-content">
                  <h2 className="affidavit-title">शपथपत्र</h2>
                  <h3 className="affidavit-subtitle">AFFIDAVIT</h3>
                  <h3 className="affidavit-subtitle">
                    (बिजली कनेक्शन हस्तांतरण हेतु सहमति पत्र –{" "}
                    {form.OfficeTyp})
                  </h3>

                  <p className="affidavit-paragraph">
                    मैं, <strong>{form.consentHolder}</strong>, पुत्र श्री{" "}
                    <strong>{form.consentHolderFather}</strong>, निवासी गाँव{" "}
                    <strong>{form.consentVillage}</strong>, तहसील{" "}
                    <strong>{form.consentTehsil}</strong>, जिला{" "}
                    <strong>{form.consentDistrict}</strong>, राज्य{" "}
                    <strong>{form.consentState}</strong>, शपथपूर्वक निम्नलिखित
                    कथन करता हूँ:
                  </p>

                  <p>
                    1. यह कि बिजली कनेक्शन/खाता संख्या{" "}
                    <strong>{form.consentAccountNo}</strong> मेरे नाम पर
                    दर्ज है।
                  </p>

                  <p>
                    2. यह कि उक्त संपत्ति/स्थान का स्वामी मेरा पुत्र श्री{" "}
                    <strong>{form.transferName}</strong>, पुत्र श्री{" "}
                    <strong>{form.transferFather}</strong>, है।
                  </p>

                  <p>
                    3. यह कि मुझे उक्त बिजली कनेक्शन/खाता संख्या{" "}
                    <strong>{form.consentAccountNo}</strong> को अपने पुत्र
                    श्री <strong>{form.transferName}</strong> के नाम
                    स्थानांतरित करवाने पर कोई आपत्ति नहीं है।
                  </p>

                  <p>
                    4. यह कि मैं उक्त बिजली कनेक्शन को अपने पुत्र के नाम पर
                    स्थानांतरित करने के लिए अपनी स्वेच्छा से सहमति प्रदान
                    करता हूँ।
                  </p>

                  <p>
                    5. यह कि उक्त बिजली कनेक्शन के हस्तांतरण के बाद भविष्य
                    में कोई विवाद उत्पन्न होने पर उसकी जिम्मेदारी श्री{" "}
                    <strong>{form.transferName}</strong> की होगी।
                  </p>

                  <p>
                    6. यह कि उक्त बिजली कनेक्शन से संबंधित बकाया राशि, यदि
                    कोई हो, के भुगतान की जिम्मेदारी श्री{" "}
                    <strong>{form.transferName}</strong> की होगी।
                  </p>

                  <p>
                    अतः संबंधित विभाग से निवेदन है कि मेरी सहमति के आधार पर
                    बिजली कनेक्शन/खाता संख्या{" "}
                    <strong>{form.consentAccountNo}</strong> को श्री{" "}
                    <strong>{form.transferName}</strong> के नाम स्थानांतरित
                    करने की कृपा की जाए।
                  </p>

                  <div className="signature-area">
                    <p>
                      दिनांक: <strong>{form.consentDate}</strong>
                    </p>
                    <p>
                      स्थान: <strong>{form.consentPlace}</strong>
                    </p>

                    <div className="signature">
                      <strong>शपथकर्ता / Deponent</strong>
                      <span>{form.consentHolder}</span>
                      <span>पुत्र श्री {form.consentHolderFather}</span>
                    </div>
                  </div>

                  <div className="verification">
                    <h3>सत्यापन / VERIFICATION</h3>
                    <p>
                      मैं सत्यापित करता हूँ कि इस शपथपत्र में लिखे गए कथन
                      मेरे ज्ञान एवं विश्वास के अनुसार सत्य और सही हैं तथा
                      कोई महत्वपूर्ण तथ्य छिपाया नहीं गया है।
                    </p>

                    <div className="verification-bottom">
                      <span>स्थान: {form.consentPlace}</span>
                      <span>दिनांक: {form.consentDate}</span>
                    </div>

                    <div className="verification-signature">
                      हस्ताक्षर: __________________
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
