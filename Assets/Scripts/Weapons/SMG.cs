using UnityEngine;

namespace NotebookWar.Weapons
{
    public class SMG : WeaponBase
    {
        [Header("SMG Specific")]
        [SerializeField] private float recoilPattern = 2f;
        [SerializeField] private float recoilRecovery = 5f;
        
        private float currentRecoil = 0f;

        protected override void Fire()
        {
            // Apply recoil to fire point
            ApplyRecoil();
            
            base.Fire();
            
            // Add recoil accumulation for rapid fire
            currentRecoil += weaponData.recoil;
        }

        private void ApplyRecoil()
        {
            if (currentRecoil > 0)
            {
                // Add random spread based on current recoil
                Vector3 recoilOffset = new Vector3(
                    Random.Range(-currentRecoil, currentRecoil) * recoilPattern,
                    Random.Range(-currentRecoil * 0.5f, currentRecoil) * recoilPattern,
                    0
                );
                
                firePoint.localRotation = Quaternion.Euler(recoilOffset);
            }
        }

        protected override void Update()
        {
            base.Update();
            
            // Recover from recoil when not firing
            if (!input.GetFireInput() && currentRecoil > 0)
            {
                currentRecoil = Mathf.Lerp(currentRecoil, 0f, recoilRecovery * Time.deltaTime);
                
                // Reset fire point rotation as recoil recovers
                firePoint.localRotation = Quaternion.Lerp(
                    firePoint.localRotation, 
                    Quaternion.identity, 
                    recoilRecovery * Time.deltaTime
                );
            }
        }
    }
}