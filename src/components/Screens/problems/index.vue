<template>
    <div v-if="show" class="ma-0 pa-0 d-flex">
        <v-col cols="3">
            <v-card v-if="!showSelectProblem" elevation="1" height="87vh">
                <v-card-title>View Options</v-card-title>
                <v-list density="compact" lines="one" :selected="['A']">
                    <v-list-item v-for="option in viewOptions" :value="option.value" active-class="bg-primary"
                        :key="option.value" @click="getProblemsView(option)">
                        <v-list-item-title>{{ option.text }}</v-list-item-title>
                    </v-list-item>
                </v-list>
                <v-btn block class="bg-primary" @click="newProblem">New Problem</v-btn>
            </v-card>
            <v-card v-if="showSelectProblem" elevation="1" height="87vh">
                <v-card>
                    <v-card-title>Problem Categories</v-card-title>
                    <v-list v-if="problemCats.length > 0" density="compact" lines="one" :selected="[problemCats[0].name]">
                        <v-list-item v-for="problem in problemCats" :value="problem.name" class="bg-primary"
                            :key="problem.id" @click="selectCatProlems(problem.problems)" :title="problem.name" />
                    </v-list>
                </v-card>
                <v-card>
                    <v-card-title>Problems</v-card-title>
                    <v-list v-if="catProblems.length > 0" density="compact" lines="one" height="300">
                        <v-list-item v-for="problem in catProblems" color="primary" :value="problem.id" :key="problem.id"
                            :title="problem.name" @click="checkDuplicateProblem(problem)" />
                    </v-list>
                </v-card>
                <v-btn class="mb-1" block @click="otherProblems">Other Problem</v-btn>
                <v-btn block @click="showSelectProblem = false">cancel</v-btn>
            </v-card>
        </v-col>
        <v-col cols="9">
            <v-card height="87vh">
                <v-card-title>{{filterName}} Problems</v-card-title>
                <v-data-table :headers="headers" :items="problems" height="81vh" density="compact">
                    <template #[`item.actions`]="{ item }">
                        <div class="d-inline-flex">
                            <v-tooltip text="Edit Problem">
                                <template v-slot:activator="{ props }">
                                    <v-btn v-if="item.columns.status !== 'R'" size="small" variant="text"
                                        class="ma-1 bg-primary" icon="mdi-square-edit-outline" v-bind="props"
                                        @click="loadPatientProblem(item.raw, false)" />
                                </template>
                            </v-tooltip>
                            <v-tooltip text="Annotate Problem">
                                <template v-slot:activator="{ props }">
                                    <v-btn v-if="item.columns.status !== 'R'" size="small" icon="mdi-forum" variant="text"
                                        class="ma-1 bg-secondary" v-bind="props" @click="addProblemComment(item.raw, {})" />
                                </template>
                            </v-tooltip>
                            <v-tooltip text="Mark as Inactive">
                                <template v-slot:activator="{ props }">
                                    <v-btn v-if="item.columns.status === 'A'" size="small" icon="mdi-bell-off-outline"
                                        variant="text" class="ma-1" v-bind="props" @click="markInactive(item.raw)" />
                                </template>
                            </v-tooltip>
                            <v-tooltip text="Remove Problem">
                                <template v-slot:activator="{ props }">
                                    <v-btn v-if="item.columns.status !== 'R'" size="small" icon="mdi-delete" variant="text"
                                        class="ma-1 bg-error" v-bind="props" @click="loadPatientProblem(item.raw, true)" />
                                </template>
                            </v-tooltip>
                            <v-tooltip text="Restore Problem">
                                <template v-slot:activator="{ props }">
                                    <v-btn v-if="item.columns.status === 'R'" size="small" icon="mdi-restore" variant="text"
                                        class="ma-1" v-bind="props" @click="restoreProblem(item.raw)" />
                                </template>
                            </v-tooltip>
                        </div>
                    </template>
                    <template #bottom>
                    </template>
                </v-data-table>
            </v-card>
        </v-col>
        <v-dialog v-if="vstDialog" v-model="vstDialog" persistent width="auto">
            <v-card>
                <SelectVisit v-if="patientInfo !== null" @closeDialog="vstDialog = false" />
            </v-card>
        </v-dialog>
        <v-dialog v-if="confirmDialog" v-model="confirmDialog" persistent width="auto">
            <v-card>
                <ConfirmDialog :message="confirmMessage" @submit="confirmDuplicate"
                    @closeDialog="confirmDialog = false" />
            </v-card>
        </v-dialog>
        <v-dialog v-if="addEditProblemDialog" v-model="addEditProblemDialog" persistent width="auto">
            <v-card>
                <AddEditProblem v-if="patientInfo !== null" :problem="selectedProblem" :remove-problem="removeProb"
                    :patient-info="patientInfo" :visit-info="visitInfo" @add-edit-comment="addProblemComment"
                    @search-problem="otherProblems" @remove="removePatientProblem" @submit="injectProblem"
                    @closeDialog="closeDialog" />
            </v-card>
        </v-dialog>
        <v-dialog v-if="AnnotateProblemDialog" v-model="AnnotateProblemDialog" persistent width="auto">
            <v-card>
                <AnotateProblem :comment="selectedComment" @submit="anotateProblem"
                    @closeDialog="AnnotateProblemDialog = false" />
            </v-card>
        </v-dialog>
        <v-dialog v-if="searchProblemDialog" v-model="searchProblemDialog" persistent width="auto">
            <v-card>
                <SearchProblem @submit="selectPatientProblem" @closeDialog="searchProblemDialog = false" />
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { VDataTable } from 'vuetify/labs/VDataTable'
import SelectVisit from '@/components/Header/SelectVisit/Dialog.vue'
import AddEditProblem from '@/components/Header/AddEditProblem/Dialog.vue';
import AnotateProblem from '@/components/Header/AnotateProblem/Dialog.vue';
import SearchProblem from '@/components/Header/SearchProblem/Dialog.vue';
import ConfirmDialog from '@/components/Header/ConfirmDialog/Dialog.vue';

export default {
    components: {
        VDataTable,
        SelectVisit,
        AddEditProblem,
        AnotateProblem,
        SearchProblem,
        ConfirmDialog
    },
    data() {
        return {
            vstDialog: false,
            addEditProblemDialog: false,
            AnnotateProblemDialog: false,
            searchProblemDialog: false,
            confirmDialog: false,
            confirmMessage: {},
            filterName:'Active',
            removeProb: false,
            selectedProblem: null,
            viewOptions: [
                { text: 'Active', value: 'A' },
                { text: 'Inactive', value: 'I' },
                { text: 'Both active and inactive', value: 'B' },
                { text: 'Removed', value: 'R' },
            ],
            show: false,
            selectedComment: null,
            showSelectProblem: false,
            headers: [
                {
                    title: 'Stat/Ver',
                    align: 'start',
                    sortable: false,
                    key: 'status',
                },
                {
                    title: 'Description',
                    align: 'star',
                    sortable: false,
                    key: 'description'
                },
                {
                    title: 'Onset Date',
                    align: 'star',
                    sortable: false,
                    key: 'onsetDate'
                },
                {
                    title: 'Last Updated',
                    align: 'star',
                    sortable: false,
                    key: 'lastUpdated'
                },
                {
                    title: 'Location',
                    align: 'star',
                    sortable: false,
                    key: 'location.name'
                },
                {
                    title: 'Actions',
                    align: 'star',
                    sortable: false,
                    key: 'actions'
                },
            ],
            problems: [],
            problemCats: [],
            catProblems: [],
        }
    },
    computed: {
        patientInfo() {
            return this.$store.getters.getPatnInfo;
        },
        visitInfo() {
            return this.$store.getters.getVisit;
        },
    },
    watch: {
        patientInfo() {
            if (this.patientInfo) {
                this.getProblemsView(this.viewOptions[0])
                this.show = true;
            }
        },
    },
    mounted() {
        if (this.patientInfo) {
            this.getProblemsView(this.viewOptions[0])
            this.show = true;
        }
    },
    methods: {
        overLay() {
            this.$store.commit('overLay');
        },
        getProblemsView(viewOption) {
            this.filterName = viewOption.text;
            this.overLay();
            var messageObject = {
                requestType: "get",
                messageType: `listPatientProblems?patientId=${this.patientInfo.id}&filter=${viewOption.value}`,
            };
            this.$store
                .dispatch("callWebService", messageObject)
                .then((result) => {
                    this.problems = result.problems;
                })
                .catch((response) => {
                    console.log(response.data.error);
                })
                .finally(() => {
                    this.overLay()
                });
        },
        newProblem() {
            if (this.visitInfo) {
                this.overLay();
                var messageObject = {
                    requestType: "get",
                    messageType: `listCommonProblems?clinicId=${this.visitInfo.clinic.id}`,
                };
                this.$store
                    .dispatch("callWebService", messageObject)
                    .then((result) => {
                        this.problemCats = result.problems;
                        if (this.problemCats.length > 0) {
                            this.selectCatProlems(this.problemCats[0].problems)
                        }
                    })
                    .catch((response) => {
                        console.log(response.data.error);
                    })
                    .finally(() => {
                        this.overLay()
                    });
                this.showSelectProblem = true;
            } else {
                this.vstDialog = true;
            }
        },
        loadPatientProblem(problem, remove) {
            if (this.visitInfo) {
                this.overLay();
                var messageObject = {
                    requestType: "get",
                    messageType: `loadPatientProblem?patientId=${this.patientInfo.id}&problemId=${problem.id}&providerId=${this.visitInfo.provider.id}`,
                };
                this.$store
                    .dispatch("callWebService", messageObject)
                    .then((result) => {
                        if (result.ok) {
                            if (remove) {
                                result.problem.problemId = problem.id;
                                this.removeProblem(result.problem)
                            } else {
                                this.editProblem(result.problem, problem.id)
                            }
                        }
                    })
                    .catch((response) => {
                        console.log(response.data.error);
                    })
                    .finally(() => {
                        this.overLay()
                    });
            } else {
                this.vstDialog = true;
            }
        },
        markInactive(problem) {
            if (this.visitInfo) {
                this.overLay();
                var messageObject = {
                    requestType: "get",
                    messageType: `inactivatePatientProblem?patientId=${this.patientInfo.id}&problemId=${problem.id}&providerId=${this.visitInfo.provider.id}`,
                };
                this.$store
                    .dispatch("callWebService", messageObject)
                    .then((result) => {
                        if (result.ok) {
                            this.getProblemsView(this.viewOptions[0])
                        }
                    })
                    .catch((response) => {
                        console.log(response.data.error);
                    })
                    .finally(() => {
                        this.overLay()
                    });
            } else {
                this.vstDialog = true;
            }
        },
        restoreProblem(problem) {
            if (this.visitInfo) {
                this.overLay();
                var messageObject = {
                    requestType: "get",
                    messageType: `inactivatePatientProblem?patientId=${this.patientInfo.id}&problemId=${problem.id}&providerId=${this.visitInfo.provider.id}`,
                };
                this.$store
                    .dispatch("callWebService", messageObject)
                    .then((result) => {
                        if (result.ok) {
                            this.getProblemsView(this.viewOptions[0])
                        }
                    })
                    .catch((response) => {
                        console.log(response.data.error);
                    })
                    .finally(() => {
                        this.overLay()
                    });
            } else {
                this.vstDialog = true;
            }
        },
        selectCatProlems(problems) {
            this.catProblems = problems;
        },
        selectPatientProblem(problem) {
            if (this.addEditProblemDialog) {
                this.selectedProblem.groupId = problem.groupId;
                this.selectedProblem.icdCode = problem.icdCode;
                this.selectedProblem.icdId = problem.icdId;
                this.selectedProblem.id = problem.id;
                this.selectedProblem.name = problem.name;
                this.selectedProblem.snomed = problem.snomed;
            } else {
                this.addProblem(problem);
            }
            this.searchProblemDialog = false;
        },
        checkDuplicateProblem(problem) {
            this.overLay();
            var messageObject = {
                requestType: "get",
                messageType: `checkDuplicateProblem?patientId=${this.patientInfo.id}&problemId=${problem.id}&problemText=${problem.name}`,
            };
            this.$store
                .dispatch("callWebService", messageObject)
                .then((result) => {
                    if (result.ok) {
                        this.addProblem(problem);
                    }
                })
                .catch((response) => {
                    if (response.data) {
                        this.confirmMessage = {
                            title: 'Problem Exists',
                            text: response.data.error + ' Do you want to proceed?',
                            problem: problem
                        }
                        this.confirmDialog = true;
                    }
                })
                .finally(() => {
                    this.overLay()
                });
        },
        confirmDuplicate() {
            this.confirmDialog = false;
            this.addProblem(this.confirmMessage.problem)
        },
        addProblem(problemCat) {
            this.selectedProblem = {};
            this.selectedProblem.status = 'ACTIVE';
            this.selectedProblem.immediacy = 'UNKNOWN';
            this.selectedProblem.groupId = problemCat.groupId;
            this.selectedProblem.icdCode = problemCat.icdCode;
            this.selectedProblem.icdId = problemCat.icdId;
            this.selectedProblem.id = problemCat.id;
            this.selectedProblem.name = problemCat.name;
            this.selectedProblem.snomed = problemCat.snomed;
            this.selectedProblem.visitDate = this.visitInfo.appointmentDate.split(' ')[0];
            this.selectedProblem.visitProviderId = this.visitInfo.provider.id;
            this.selectedProblem.clinicId = this.visitInfo.clinic.id;
            this.selectedProblem.patientId = this.patientInfo.id;
            this.selectedProblem.onsetDate = '';
            this.addEditProblemDialog = true;
        },
        editProblem(problem, problemId) {
            this.selectedProblem = problem;
            this.selectedProblem.problemId = problemId;
            this.selectedProblem.visitDate = this.visitInfo.appointmentDate.split(' ')[0];
            this.selectedProblem.visitProviderId = this.visitInfo.provider.id;
            this.selectedProblem.patientId = this.patientInfo.id;
            this.addEditProblemDialog = true;
        },
        injectProblem() {
            let patientProblem = {};
            patientProblem.patientId = this.selectedProblem.patientId;
            patientProblem.icdId = this.selectedProblem.icdId;
            patientProblem.icdCode = this.selectedProblem.icdCode;
            patientProblem.name = this.selectedProblem.name;
            patientProblem.id = this.selectedProblem.id;
            patientProblem.status = this.selectedProblem.status;
            patientProblem.onsetDate = this.selectedProblem.onsetDate;
            patientProblem.visitProviderId = this.selectedProblem.visitProviderId;
            patientProblem.responsibleProviderId = this.selectedProblem.responsibleProvider.id;
            patientProblem.clinicId = this.selectedProblem.clinic.id;
            patientProblem.snomed = this.selectedProblem.snomed;
            patientProblem.groupId = this.selectedProblem.groupId;
            patientProblem.visitDate = this.selectedProblem.visitDate;
            patientProblem.immediacy = this.selectedProblem.status === 'ACTIVE' ? this.selectedProblem.immediacy : '';
            if (this.selectedProblem.problemId) {
                patientProblem.problemId = this.selectedProblem.problemId;
                patientProblem.oldComments = this.selectedProblem.oldComments ? this.selectedProblem.oldComments : [];
                patientProblem.newComments = this.selectedProblem.newComments ? this.selectedProblem.newComments : [];
            } else {
                patientProblem.comments = this.selectedProblem.newComments ? this.selectedProblem.newComments : [];
            }
            console.log('Patient Problem',patientProblem)
            this.addEditProblem(patientProblem);
        },
        addEditProblem(patientProblem) {
            this.overLay();
            var messageObject = {
                requestType: "post",
                messageType: patientProblem.problemId ? 'editPatientProblem' : 'addPatientProblem',
                credentials: patientProblem
            };
            this.$store
                .dispatch("callWebService", messageObject)
                .then((result) => {
                    if (result.ok) {
                        this.getProblemsView(this.viewOptions[0]);
                        this.addEditProblemDialog = false;
                    }
                })
                .catch((response) => {
                    console.log(response.data.error);
                })
                .finally(() => {
                    this.overLay()
                });
        },
        addProblemComment(problem, comment) {
            this.selectedProblem = problem;
            this.selectedComment = comment;
            this.AnnotateProblemDialog = true;
        },
        anotateProblem() {
            if (this.addEditProblemDialog) {
                if (this.selectedComment.id) {
                    this.selectedComment.date = this.$moment().format('l');
                } else {
                    if (this.selectedProblem.newComments) {
                        this.selectedProblem.newComments.push(this.selectedComment.comment)
                        this.selectedProblem.comments.push({
                            date: this.$moment().format('l'),
                            comment: this.selectedComment.comment
                        })
                    } else {
                        this.selectedProblem.newComments = [this.selectedComment.comment]
                        const comment = {
                            date: this.$moment().format('l'),
                            comment: this.selectedComment.comment
                        };
                        if (this.selectedProblem.comments) {
                            this.selectedProblem.comments.push(comment)
                        } else {
                            this.selectedProblem.comments = [comment]
                        }
                    }
                }
            } else {
                this.overLay();
                var messageObject = {
                    requestType: "post",
                    messageType: `annotatePatientProblem`,
                    credentials: {
                        "patientId": this.patientInfo.id,
                        "problemId": this.selectedProblem.id,
                        "providerId": this.visitInfo.provider.id,
                        "comment": this.selectedComment.comment
                    }
                };
                this.$store
                    .dispatch("callWebService", messageObject)
                    .then((result) => {
                        if (result.ok) {
                            this.selectedProblem = null;
                        }
                    })
                    .catch((response) => {
                        console.log(response.data.error);
                    })
                    .finally(() => {
                        this.overLay()
                    });
            }
            this.AnnotateProblemDialog = false;
        },
        otherProblems() {
            this.searchProblemDialog = true;
        },
        removeProblem(problem) {
            this.selectedProblem = problem;
            this.removeProb = true;
            this.addEditProblemDialog = true;
        },
        removePatientProblem() {
            this.overLay();
            var messageObject = {
                requestType: "post",
                messageType: `removePatientProblem`,
                credentials: {
                    "patientId": this.patientInfo.id,
                    "problemId": this.selectedProblem.problemId,
                    "providerId": this.visitInfo.provider.id,
                    "comment": this.selectedProblem.reason
                }
            };
            this.$store
                .dispatch("callWebService", messageObject)
                .then((result) => {
                    if (result.ok) {
                        this.selectedProblem = null;
                        this.removeProb = false;
                        this.addEditProblemDialog = false;
                        this.getProblemsView(this.viewOptions[0])
                    }
                })
                .catch((response) => {
                    console.log(response.data.error);
                })
                .finally(() => {
                    this.overLay()
                });
        },
        closeDialog() {
            this.removeProb = false;
            this.showSelectProblem = false;
            this.addEditProblemDialog = false;
        },
    }
}
</script>